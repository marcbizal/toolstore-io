const CHUNK_HEADER_SIZE = 8;
const SUBCHUNK_HEADER_SIZE = 6;

function getChunkHeaderSize(isSubchunk = false) {
  return isSubchunk ? SUBCHUNK_HEADER_SIZE : CHUNK_HEADER_SIZE;
}

function parseChunkHeader(buffer, isSubchunk = false) {
  let offset = 0;
  const header = {};

  header.tag = buffer.toString('utf8', offset, offset + 4);
  offset += 4;

  header.length = isSubchunk ? buffer.readUInt16BE(offset) : buffer.readUInt32BE(offset);

  return header;
}

function parseChunks(buffer, parsers, isSubchunk = false) {
  let offset = 0;
  const chunks = {};

  while (offset < buffer.length) {
    const headerSize = getChunkHeaderSize(isSubchunk);
    const { tag, length } = parseChunkHeader(buffer.slice(offset, offset + headerSize), isSubchunk);

    offset += headerSize;

    const parser = parsers[tag] || (() => {
      console.warn(`${isSubchunk ? 'Subchunk' : 'Chunk'} parser not found for ${tag}`);
      return null;
    });

    const chunk = parser(buffer.slice(offset, offset + length));
    offset += length;

    if (Array.isArray(chunks[tag])) {
      chunks[tag].push(chunk);
    } else if (chunks[tag]) {
      chunks[tag] = [chunks[tag], chunk];
    } else {
      chunks[tag] = chunk;
    }

    if (length % 2) offset += 1;
  }

  return chunks;
}

module.exports = {
  getChunkHeaderSize,
  parseChunkHeader,
  parseChunks,
};
