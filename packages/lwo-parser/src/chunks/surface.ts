import * as core from '../core-types'
import * as iff from '../chunk-parser'
import { Wrap, Surface, SequenceOptions } from '../types'

function parseWrap(buffer: Buffer): Wrap {
  return {
    widthWrap: buffer.readUInt16BE(0),
    heightWrap: buffer.readUInt16BE(0),
  }
}

function parseSequenceOptions(buffer: Buffer): SequenceOptions {
  return {
    offset: buffer.readUInt16BE(0),
    flags: core.parseBitFlags(buffer, ['loop', 'interlace']),
    loopLength: buffer.readUInt16BE(0),
  }
}

export function parseSurface(buffer: Buffer): Surface {
  let offset = 0
  const surface: Partial<Surface> = {}

  surface.name = core.parseString(buffer)
  offset += surface.name.length + (surface.name.length % 2)

  surface.attributes = iff.parseChunks(
    buffer.slice(offset),
    {
      COLR: core.parseColor,
      FLAG: buf =>
        core.parseBitFlags(buf, [
          'luminous',
          'outline',
          'smoothing',
          'colorHighlights',
          'colorFilter',
          'opaqueEdge',
          'transparentEdge',
          'sharpTerminator',
          'doubleSided',
          'additive',
          'shadowAlpha',
        ]),

      LUMI: core.parseInt16BE,
      DIFF: core.parseInt16BE,
      SPEC: core.parseInt16BE,
      REFL: core.parseInt16BE,
      TRAN: core.parseInt16BE,

      VLUM: core.parseFloatBE,
      VDIF: core.parseFloatBE,
      VSPC: core.parseFloatBE,
      VRFL: core.parseFloatBE,
      VTRN: core.parseFloatBE,

      GLOS: core.parseInt16BE,

      RIMG: core.parseString,
      RFLT: core.parseUInt16BE,
      RSAN: core.parseFloatBE,
      RIND: core.parseFloatBE,

      EDGE: core.parseFloatBE,
      SMAN: core.parseFloatBE,

      CTEX: core.parseString,
      DTEX: core.parseString,
      STEX: core.parseString,
      RTEX: core.parseString,
      TTEX: core.parseString,
      LTEX: core.parseString,
      BTEX: core.parseString,

      TFLG: buf =>
        core.parseBitFlags(buf, [
          'x',
          'y',
          'z',
          'worldCoords',
          'negativeImage',
          'pixelBlending',
          'antialiasing',
        ]),

      TSIZ: core.parseVector,
      TCTR: core.parseVector,
      TFAL: core.parseVector,
      TVEL: core.parseVector,

      TCLR: core.parseColor,

      TVAL: core.parseInt16BE,

      TAMP: core.parseFloatBE,

      TIMG: core.parseString,
      TALP: core.parseString,

      TWRP: parseWrap,

      TAAS: core.parseFloatBE,
      TOPC: core.parseFloatBE,

      IMSQ: parseSequenceOptions,
    },
    true,
  )

  return surface as Surface
}
