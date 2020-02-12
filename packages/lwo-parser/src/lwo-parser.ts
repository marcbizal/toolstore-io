import * as iff from './chunk-parser'
import { parsePoints, parsePolygons, parseSurface, parseSurfaceNames } from './chunks'
import { LightwaveObject } from './types';

export function parseBuffer(buffer: Buffer, rawPoints: boolean = false): Partial<LightwaveObject> {
  let offset = 0;

  const { length } = iff.parseChunkHeader(buffer.slice(offset, iff.getChunkHeaderSize()));
  offset += iff.getChunkHeaderSize();

  const magic = buffer.toString('utf8', offset, offset + 4);
  if (magic !== 'LWOB') {
    throw new Error('file format is not supported');
  }
  offset += 4;

  return iff.parseChunks(buffer.slice(offset, offset + length), {
    PNTS: rawPoints ? source => source.buffer : parsePoints,
    SRFS: parseSurfaceNames,
    POLS: parsePolygons,
    SURF: parseSurface,
  });
}
