import { Vector, Color } from './types'

export function parseString(buffer: Buffer): string {
  let offset = 0;

  while (offset < buffer.length) {
    if (buffer.readUInt8(offset) === 0) {
      return buffer.toString('utf8', 0, offset + 1);
    }
    offset += 1;
  }

  throw new Error('Never reached the end of a null terminated string.')
}

export const VEC12_SIZE = 12;

export function parseVector(buffer: Buffer): Vector {
  return {
    x: buffer.readFloatBE(0),
    y: buffer.readFloatBE(4),
    z: buffer.readFloatBE(8),
  };
}

export function parseColor(buffer: Buffer): Color {
  return {
    red: buffer.readUInt8(0),
    green: buffer.readUInt8(1),
    blue: buffer.readUInt8(2),
    pad: buffer.readUInt8(0),
  };
}
