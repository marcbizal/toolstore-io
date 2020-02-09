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

const parsers = {
  getSizeOf(type) {
    return PRIMITIVE_TYPES[type];
  },
  parseBitFlags(buffer, names, from = 'UInt16BE') {
    const flags = {};
    const bytes = buffer[`read${from}`](0);
    for (let i = 0; i < names.length; i += 1) {
      flags[names[i]] = (bytes >> i) & 1;
    }
    return flags;
  },
};

Object.keys(PRIMITIVE_TYPES).forEach((type) => {
  parsers[`parse${type}`] = (buffer => buffer[`read${type}`](0));
});

module.exports = parsers;
