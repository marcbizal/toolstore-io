import * as THREE from 'three'
import _ from 'lodash'

import BitmapParser from './bmp-parser'

const getFileName = url =>
  url
    .replace(/[?#].*$/, '')
    .split('/')
    .pop()

THREE.FileLoader.prototype.loadAsync = function(url, onProgress = _.noop) {
  return new Promise((resolve, reject) =>
    this.load(url, resolve, onProgress, reject),
  )
}

async function loadBMP(url) {
  try {
    const filename = getFileName(url)
    const alphaMatch = filename.match(/A(\d+)_/)

    if (_.isNull(alphaMatch)) {
      throw new Error(
        "Bitmap doesn't contain alpha in filename, falling back...",
      )
    }

    const alpha = parseInt(alphaMatch.pop(), 10)

    const loader = new THREE.FileLoader()
    loader.setResponseType('arraybuffer')

    const buffer = Buffer.from(await loader.loadAsync(url))

    const bmp = BitmapParser.parse(buffer)

    const rgbColors = _.chain(bmp.colors)
      .chunk(4) // split into 4 byte chunks
      .map(color =>
        _.chain(color)
          .reverse() // colors are in gbr order, reverse to rgb
          .drop() // drop the reserved byte
          .value(),
      )
      .value()

    const rgbaData = _.chain(bmp.data)
      .map(i => [...rgbColors[i], i === alpha ? 0 : 255])
      .flatten()
      .value()

    const { width, height } = bmp.infoHeader

    var texture = new THREE.DataTexture(
      Uint8Array.from(rgbaData),
      width,
      height,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
      THREE.UVMapping,
    )
    texture.needsUpdate = true

    return texture
  } catch (error) {
    let fallback = new THREE.TextureLoader()
    return fallback.load(url)
  }
}

export default loadBMP
