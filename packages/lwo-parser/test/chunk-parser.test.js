const expect = require('chai').expect;
const chunk = require('../lib/chunk-parser');
const core = require('../lib/core-types');
const parsePoints = require('../lib/chunks/points').parsePoints;
const parseSurfaceNames = require('../lib/chunks/surface-names').parseSurfaceNames;

describe('Chunk Parser', () => {
  describe('#parseChunks()', () => {
    it('should parse subchunks with their assigned parsers', () => {
      const buffer = new Buffer('434f4c520004008272005350454300020100', 'hex');

      const subchunks = chunk.parseChunks(buffer, {
        COLR: core.parseColor,
        SPEC: core.parseUInt16BE,
      }, true);

      expect(subchunks).to.deep.equal({
        COLR: { red: 0, green: 130, blue: 114, pad: 0 },
        SPEC: 256,
      });
    });

    it('should parse chunks with their assigned parsers', () => {
      const buffer = new Buffer('504e54530000000c40a0000000000000c120000053524653000000046c776f00', 'hex');

      const chunks = chunk.parseChunks(buffer, {
        PNTS: parsePoints,
        SRFS: parseSurfaceNames,
      });

      expect(chunks).to.deep.equal({
        PNTS: [{ x: 5, y: 0, z: -10 }],
        SRFS: ['lwo\u0000'],
      });
    });

    it('should parse an array of chunks with the same tag', () => {
      const buffer = new Buffer('535552460000000101005355524600000001020053555246000000010300', 'hex');

      const chunks = chunk.parseChunks(buffer, {
        SURF: core.parseUInt8,
      });

      expect(chunks).to.deep.equal({ SURF: [1, 2, 3] });
    });

    it('should parse null for unknown chunk', () => {
      const buffer = new Buffer('524F434B00000000', 'hex');

      const chunks = chunk.parseChunks(buffer, {});

      expect(chunks).to.deep.equal({ ROCK: null });
    });
  });
});
