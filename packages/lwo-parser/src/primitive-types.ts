import { Flags } from "./types";

const PRIMITIVE_TYPES = {
  UInt8: 1,
  UInt16LE: 2,
  UInt16BE: 2,
  UInt32LE: 4,
  UInt32BE: 4,
  Int8: 1,
  Int16LE: 2,
  Int16BE: 2,
  Int32LE: 4,
  Int32BE: 4,
  FloatLE: 4,
  FloatBE: 4,
  DoubleLE: 8,
  DoubleBE: 8,
};

type PrimitiveType = keyof typeof PRIMITIVE_TYPES

export const getSizeOf = (type: PrimitiveType): number => {
  return PRIMITIVE_TYPES[type];
}

export const parseBitFlags = (buffer: Buffer, names: string[]): Flags => {
  const flags: Flags = {}
  const bytes = buffer.readUInt16BE(0);
  for (let i = 0; i < names.length; i += 1) {
    flags[names[i]] = (bytes >> i) & 1;
  }
  return flags;
}

export const parseUInt8 = (buffer: Buffer) => buffer.readUInt8(0)
export const parseUInt16LE = (buffer: Buffer) => buffer.readUInt16LE(0)
export const parseUInt16BE = (buffer: Buffer) => buffer.readUInt16BE(0)
export const parseUInt32LE = (buffer: Buffer) => buffer.readUInt32LE(0)
export const parseUInt32BE = (buffer: Buffer) => buffer.readUInt32BE(0)
export const parseInt8 = (buffer: Buffer) => buffer.readInt8(0)
export const parseInt16LE = (buffer: Buffer) => buffer.readInt16LE(0)
export const parseInt16BE = (buffer: Buffer) => buffer.readInt16BE(0)
export const parseInt32LE = (buffer: Buffer) => buffer.readInt32LE(0)
export const parseInt32BE = (buffer: Buffer) => buffer.readInt32BE(0)
export const parseFloatLE = (buffer: Buffer) => buffer.readFloatLE(0)
export const parseFloatBE = (buffer: Buffer) => buffer.readFloatBE(0)
export const parseDoubleLE = (buffer: Buffer) => buffer.readDoubleLE(0)
export const parseDoubleBE = (buffer: Buffer) => buffer.readDoubleBE(0)
