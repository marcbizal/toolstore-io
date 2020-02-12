import { Polygon } from '../types'

export function getPolygonSize(polygon: Polygon): number {
  return 4 + (polygon.vert.length * 2);
}

export function parsePolygon(buffer: Buffer): Polygon {
  const polygon: Partial<Polygon> = {};
  polygon.vert = [];
  let offset = 0;

  polygon.numvert = buffer.readUInt16BE(offset);
  offset += 2;

  for (let i = 0; i < polygon.numvert; i += 1) {
    polygon.vert[i] = buffer.readUInt16BE(offset);
    offset += 2;
  }

  polygon.surf = buffer.readUInt16BE(offset);

  return polygon as Polygon;
}

export function parsePolygons(buffer: Buffer): Polygon[] {
  let offset = 0;
  const polygons = [];

  while (offset < buffer.length) {
    const polygon = parsePolygon(buffer.slice(offset));
    polygons.push(polygon);
    offset += getPolygonSize(polygon);
  }

  return polygons;
}
