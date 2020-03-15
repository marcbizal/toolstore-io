import * as THREE from "three";
import {
  KochanekBartelsInterpolant,
  InterpolateKochanekBartels
} from "./KochanekBartelsInterpolant";

export const InterpolateMixed = 2320;

export class MixedInterpolant extends THREE.Interpolant {
  public linearInterpolant: THREE.LinearInterpolant;
  public kochanekBartelsInterpolant: KochanekBartelsInterpolant;

  private static PARAMETER_SIZE = 4;

  constructor(
    parameterPositions: any,
    sampleValues: any,
    sampleSize: number,
    resultBuffer?: any
  ) {
    super(parameterPositions, sampleValues, sampleSize, resultBuffer);

    this.linearInterpolant = new THREE.LinearInterpolant(
      parameterPositions,
      sampleValues,
      sampleSize,
      resultBuffer
    );

    this.kochanekBartelsInterpolant = new KochanekBartelsInterpolant(
      parameterPositions,
      sampleValues,
      sampleSize,
      resultBuffer
    );

    this.kochanekBartelsInterpolant.settings = {
      parameters: true,
      parametersOffset: 1,
      parametersSize: 4
    };
  }

  protected intervalChanged_(i1: number, t0: number, t1: number) {
    // @ts-ignore
    this.linearInterpolant.intervalChanged_(i1, t0, t1);

    // @ts-ignore
    this.kochanekBartelsInterpolant.intervalChanged_(i1, t0, t1);
  }

  public interpolate_(i1: number, x0: number, x: number, x1: number) {
    const stride = this.valueSize;
    const mode: THREE.InterpolationModes = this.sampleValues[
      (i1 + 1) * stride - MixedInterpolant.PARAMETER_SIZE
    ];

    switch (mode) {
      case InterpolateKochanekBartels:
        return this.kochanekBartelsInterpolant.interpolate_(i1, x0, x, x1);
      default:
        console.warn(
          `MixedInterpolant does not support interpolation mode: ${mode}`
        );
      case THREE.InterpolateLinear:
        return this.linearInterpolant
          .interpolate_(i1, x0, x, x1)
          .slice(0, -MixedInterpolant.PARAMETER_SIZE);
    }
  }
}
