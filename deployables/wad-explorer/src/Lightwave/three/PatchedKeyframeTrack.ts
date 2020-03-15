import * as THREE from "three";
import {
  KochanekBartelsInterpolant,
  KochanekBartelsInterpolantSettings,
  InterpolateKochanekBartels
} from "./KochanekBartelsInterpolant";
import { MixedInterpolant, InterpolateMixed } from "./MixedInterpolant";

export type InterpolantSettings = Partial<KochanekBartelsInterpolantSettings>;

export class PatchedKeyframeTrack extends THREE.KeyframeTrack {
  // @ts-ignore
  public createInterpolant: (result: Float32Array) => THREE.Interpolant;

  public interpolantSettings: InterpolantSettings = {};

  public InterpolantFactoryMethodKochanekBartels(
    result: Float32Array
  ): KochanekBartelsInterpolant {
    const interpolant = new KochanekBartelsInterpolant(
      this.times,
      this.values,
      // TODO: Submit typo fix PR for '@types/three'
      // @ts-ignore
      this.getValueSize(),
      result
    );

    interpolant.settings = this.interpolantSettings;

    return interpolant;
  }

  public InterpolantFactoryMethodMixed(result: Float32Array): MixedInterpolant {
    return new MixedInterpolant(
      this.times,
      this.values,
      // TODO: Submit typo fix PR for '@types/three'
      // @ts-ignore
      this.getValueSize(),
      result
    );
  }

  public setInterpolation(
    interpolation: THREE.InterpolationModes
  ): THREE.KeyframeTrack {
    switch (interpolation) {
      case InterpolateKochanekBartels:
        this.createInterpolant = this.InterpolantFactoryMethodKochanekBartels;
        break;
      case InterpolateMixed:
        this.createInterpolant = this.InterpolantFactoryMethodMixed;
        break;
      default:
        return super.setInterpolation(interpolation);
    }

    return this;
  }

  public getInterpolation(): THREE.InterpolationModes {
    switch (this.createInterpolant) {
      case this.InterpolantFactoryMethodKochanekBartels:
        return InterpolateKochanekBartels;
      case this.InterpolantFactoryMethodMixed:
        return InterpolateMixed;
      default:
        return super.getInterpolation();
    }
  }
}
