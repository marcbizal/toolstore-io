export const CHUNK_HEADER_SIZE = 8;
export const SUBCHUNK_HEADER_SIZE = 6;

export function getChunkHeaderSize(isSubchunk = false) {
  return isSubchunk ? SUBCHUNK_HEADER_SIZE : CHUNK_HEADER_SIZE;
}

export interface ChunkHeader {
  tag: string,
  length: number
}

export function parseChunkHeader(buffer: Buffer, isSubchunk = false): ChunkHeader {
  let offset = 0;
  const header: Partial<ChunkHeader> = {};

  header.tag = buffer.toString('utf8', offset, offset + 4);
  offset += 4;

  header.length = isSubchunk ? buffer.readUInt16BE(offset) : buffer.readUInt32BE(offset);

  return header as ChunkHeader;
}

export function isKnownTag<T>(parsers: T, tag: any): tag is keyof T {
  return tag in parsers
}

export function parseChunks<T extends {}>(
  buffer: Buffer,
  parsers: { [K in keyof T]: (buffer: Buffer) => T[K] },
  isSubchunk = false): (Partial<T> & { [unknown: string]: null }) {
  let offset = 0;
  const chunks: { [unknown: string]: any } = {};

  while (offset < buffer.length) {
    const headerSize = getChunkHeaderSize(isSubchunk);
    const { tag, length } = parseChunkHeader(buffer.slice(offset, offset + headerSize), isSubchunk);

    offset += headerSize;

    const parser = isKnownTag(parsers, tag) ? parsers[tag] : (() => {
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

  return chunks as Partial<T> & { [unknown: string]: any };
}
