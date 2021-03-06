const expect = require('chai').expect;
const core = require('../lib/core-types');

describe('Composite Parsers', () => {
  describe('#parseString()', () => {
    it('should parse zero terminated string', () => {
      const buffer = new Buffer('79656c6c6f7720706c61737469630000', 'hex');

      const string = core.parseString(buffer);
      expect(string).to.equal('yellow plastic ');
    });

    it('should parse null if no zero is found before the end of the buffer', () => {
      const buffer = new Buffer('79656c6c6f7720706c6173746963', 'hex');

      const string = core.parseString(buffer);
      expect(string).to.equal(null);
    });
  });

  describe('#parseVector()', () => {
    it('should parse Vector from 12 bytes', () => {
      const buffer = new Buffer('40a0000000000000c1200000', 'hex');

      const vector = core.parseVector(buffer);
      expect(vector).to.deep.equal({ x: 5, y: 0, z: -10 });
    });
  });

  describe('#parseColor', () => {
    it('should parse 24-bit color with 8-bit pad', () => {
      const buffer = new Buffer('00827200', 'hex');

      const color = core.parseColor(buffer);
      expect(color).to.deep.equal({ red: 0, green: 130, blue: 114, pad: 0 });
    });
  });
});

describe('Primitve Parsers', () => {
  describe('#getSizeOf()', () => {
    it('should return the size of a primitive', () => {
      expect(core.getSizeOf('UInt32BE')).to.equal(4);
    });
  });

  describe('#parseBitFlags()', () => {
    it('should parse an array of named flags', () => {
      const buffer = new Buffer([0b00000000, 0b00000100]);

      const flags = core.parseBitFlags(buffer, ['x', 'y', 'z', 'worldCoords', 'negativeImage', 'pixelBlending', 'antialias']);

      expect(flags).to.have.property('z');
      expect(flags.z).to.equal(1);
    });
  });
});
