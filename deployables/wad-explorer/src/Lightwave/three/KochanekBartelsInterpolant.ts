import * as THREE from "three";

export const InterpolateKochanekBartels: THREE.InterpolationModes = 2310;

export interface KochanekBartelsInterpolantSettings {
  endingStart: THREE.InterpolationEndingModes;
  endingEnd: THREE.InterpolationEndingModes;
  parameters: boolean;
  parametersSize: number;
  parametersOffset: number;
  tension: number;
  continuity: number;
  bias: number;
}

export class KochanekBartelsInterpolant extends THREE.Interpolant {
  public settings: Partial<KochanekBartelsInterpolantSettings> = {};

  protected _offsetNext = 0;
  protected _offsetPrev = 0;
  protected _weightNext = 0;
  protected _weightPrev = 0;

  private static TENSION_OFFSET = 0;
  private static CONTINUITY_OFFSET = 1;
  private static BIAS_OFFSET = 2;

  private getParameterSize_() {
    const { parameters, parametersSize } = this.getSettings_();
    return parameters ? parametersSize : 0;
  }

  protected DefaultSettings_ = {
    endingStart: THREE.ZeroSlopeEnding,
    endingEnd: THREE.ZeroSlopeEnding,
    parameters: false,
    parametersSize: 3,
    parametersOffset: 0,
    tension: 0,
    continuity: 0,
    bias: 0
  };

  protected getSettings_() {
    return {
      ...this.DefaultSettings_,
      ...this.settings
    };
  }

  protected intervalChanged_(i1: number, t0: number, t1: number) {
    var pp = this.parameterPositions,
      iPrev = i1 - 2,
      iNext = i1 + 1,
      tPrev = pp[iPrev],
      tNext = pp[iNext];

    if (tPrev === undefined) {
      switch (this.getSettings_().endingStart) {
        case THREE.ZeroSlopeEnding:
          // f'(t0) = 0
          iPrev = i1;
          tPrev = 2 * t0 - t1;

          break;

        case THREE.WrapAroundEnding:
          // use the other end of the curve
          iPrev = pp.length - 2;
          tPrev = t0 + pp[iPrev] - pp[iPrev + 1];

          break;

        default:
          // ZeroCurvatureEnding

          // f''(t0) = 0 a.k.a. Natural Spline
          iPrev = i1;
          tPrev = t1;
      }
    }

    if (tNext === undefined) {
      switch (this.getSettings_().endingEnd) {
        case THREE.ZeroSlopeEnding:
          // f'(tN) = 0
          iNext = i1;
          tNext = 2 * t1 - t0;

          break;

        case THREE.WrapAroundEnding:
          // use the other end of the curve
          iNext = 1;
          tNext = t1 + pp[1] - pp[0];

          break;

        default:
          // ZeroCurvatureEnding

          // f''(tN) = 0, a.k.a. Natural Spline
          iNext = i1 - 1;
          tNext = t0;
      }
    }

    const stride = this.valueSize;

    this._weightPrev = (2 * (t1 - t0)) / (t0 - tPrev + (t1 - t0));
    this._weightNext = (2 * (t1 - t0)) / (t1 - t0 + (tNext - t1));
    this._offsetPrev = iPrev * stride;
    this._offsetNext = iNext * stride;
  }

  public interpolate_(i1: number, x0: number, x: number, x1: number) {
    const t = (x - x0) / (x1 - x0);

    const s = new THREE.Vector4(t ** 3, t ** 2, t ** 1, 1);

    // prettier-ignore
    const h = new THREE.Matrix4().fromArray([
      2, -2, 1, 1,
      -3, 3, -2, -1,
      0, 0, 1, 0,
      1, 0, 0, 0
    ]);

    const settings = this.getSettings_();
    const result = this.resultBuffer;
    const values = this.sampleValues;
    const stride = this.valueSize;

    const offset = i1 * stride;

    const sampleSize = this.valueSize - this.getParameterSize_();

    for (let i = 0; i !== sampleSize; ++i) {
      let tension;
      let continuity;
      let bias;

      if (settings.parameters) {
        tension =
          values[
          offset +
          sampleSize +
          settings.parametersOffset +
          KochanekBartelsInterpolant.TENSION_OFFSET
          ];
        continuity =
          values[
          offset +
          sampleSize +
          settings.parametersOffset +
          KochanekBartelsInterpolant.CONTINUITY_OFFSET
          ];
        bias =
          values[
          offset +
          sampleSize +
          settings.parametersOffset +
          KochanekBartelsInterpolant.BIAS_OFFSET
          ];
      } else {
        tension = settings.tension;
        continuity = settings.continuity;
        bias = settings.bias;
      }

      const p0 = values[offset - stride + i];
      const p1 = values[offset + i];
      const pPrev = values[this._offsetPrev + i];
      const pNext = values[this._offsetNext + i];

      // DS of P0
      const d0a = ((1 - tension) * (1 - continuity) * (1 + bias)) / 2;
      const d0b = ((1 - tension) * (1 + continuity) * (1 - bias)) / 2;
      const startingTangent = d0a * (p0 - pPrev) + d0b * (p1 - p0);

      // DD of P1
      const d1a = ((1 - tension) * (1 + continuity) * (1 + bias)) / 2;
      const d1b = ((1 - tension) * (1 - continuity) * (1 - bias)) / 2;
      const endingTangent = d1a * (p1 - p0) + d1b * (pNext - p1);

      const C = new THREE.Vector4(
        p0,
        p1,
        this._weightPrev * startingTangent,
        this._weightNext * endingTangent
      );

      result[i] = s
        .clone()
        .applyMatrix4(h)
        .dot(C);
    }

    return [...result];
  }
}
