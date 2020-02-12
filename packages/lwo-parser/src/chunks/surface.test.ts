const expect = require('chai').expect;
const { parseWrap, parseSurface } = require('../../lib/chunks/surface');

describe('Surface Parser', () => {
  describe('#parseSurface()', () => {
    it('should parse a surface', () => {
      const buffer = new Buffer('79656c6c6f7720706c61737469630000434f4c520004ffcc0000464c414700020004', 'hex');

      const surface = parseSurface(buffer);

      expect(surface).to.deep.equal({
        name: 'yellow plastic\u0000',
        attributes: {
          COLR: {
            blue: 0,
            green: 204,
            pad: 255,
            red: 255,
          },
          FLAG: {
            additive: 0,
            colorFilter: 0,
            colorHighlights: 0,
            doubleSided: 0,
            luminous: 0,
            opaqueEdge: 0,
            outline: 0,
            shadowAlpha: 0,
            sharpTerminator: 0,
            smoothing: 1,
            transparentEdge: 0,
          },
        },
      });
    });
  });

  describe('#parseWrap()', () => {
    it('should parse a TWRP shubchunk', () => {
      const buffer = new Buffer('00020002', 'hex');

      const wrap = parseWrap(buffer);
      expect(wrap).to.deep.equal({ widthWrap: 2, heightWrap: 2 });
    });
  });
});
