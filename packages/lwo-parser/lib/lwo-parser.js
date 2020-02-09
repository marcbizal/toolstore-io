window.Buffer = require('buffer/').Buffer;

const iff = require('./chunk-parser');
const parsePoints = require('./chunks/points').parsePoints;
const parseSurfaceNames = require('./chunks/surface-names').parseSurfaceNames;
const parsePolygons = require('./chunks/polygons').parsePolygons;
const parseSurface = require('./chunks/surface').parseSurface;

function parseBuffer(buffer, rawPoints = false) {
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

module.exports = {
  parseBuffer,
};
