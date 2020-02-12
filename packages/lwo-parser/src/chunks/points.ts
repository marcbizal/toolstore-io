import * as core from '../core-types';
import { Vector } from '../types'

export function parsePoints(buffer: Buffer): Vector[] {
  if (buffer.length % core.VEC12_SIZE !== 0) {
    throw new Error(`F12 does not evenly divide into chunk size (${buffer.length}); possible corruption`);
  }

  const pointLocations = [];
  for (let offset = 0; offset < buffer.length; offset += core.VEC12_SIZE) {
    pointLocations.push(core.parseVector(buffer.slice(offset, offset + core.VEC12_SIZE)));
  }

  return pointLocations;
}
