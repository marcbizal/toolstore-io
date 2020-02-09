function parseString(buffer) {
  let offset = 0;

  while (offset < buffer.length) {
    if (buffer.readUInt8(offset) === 0) {
      return buffer.toString('utf8', 0, offset + 1);
    }
    offset += 1;
  }

  return null;
}

const VEC12_SIZE = 12;

function parseVector(buffer) {
  return {
    x: buffer.readFloatBE(0),
    y: buffer.readFloatBE(4),
    z: buffer.readFloatBE(8),
  };
}

function parseColor(buffer) {
  return {
    red: buffer.readUInt8(0),
    green: buffer.readUInt8(1),
    blue: buffer.readUInt8(2),
    pad: buffer.readUInt8(0),
  };
}

module.exports = {
  parseString,
  VEC12_SIZE,
  parseVector,
  parseColor,
};
