const expect = require('chai').expect;
const { getPolygonSize, parsePolygons, parsePolygon } = require('../../lib/chunks/polygons');

describe('Polygon Parser', () => {
  describe('#parsePolygon()', () => {
    it('should parse a single polygon', () => {
      const buffer = new Buffer('0004005b005e006500620004', 'hex');

      const polygon = parsePolygon(buffer);

      expect(polygon).to.deep.equal({
        vert: [
          91,
          94,
          101,
          98,
        ],
        numvert: 4,
        surf: 4,
      });
    });
  });

  describe('#parsePolygons()', () => {
    it('should parse an array of polygons', () => {
      const buffer = new Buffer('0004005b005e0065006200010004004d00460045004a0001000400290026000c000f0002', 'hex');

      const polygons = parsePolygons(buffer);

      expect(polygons).to.have.lengthOf(3);
    });
  });

  describe('#getPolygonSize()', () => {
    it('should return the size of a polygon in bytes', () => {
      const buffer = new Buffer('0004005b005e006500620001', 'hex');

      const polygonSize = getPolygonSize(parsePolygon(buffer));

      expect(polygonSize).to.equal(12);
    });
  });
});
