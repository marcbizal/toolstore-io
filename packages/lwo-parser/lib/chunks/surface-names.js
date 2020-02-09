const core = require('../core-types');

function parseSurfaceNames(buffer) {
  let offset = 0;
  const surfaceNames = [];

  while (offset < buffer.length) {
    const surfaceName = core.parseString(buffer.slice(offset));
    surfaceNames.push(surfaceName);
    offset += surfaceName.length + (surfaceName.length % 2);
  }

  return surfaceNames;
}

module.exports = { parseSurfaceNames };
