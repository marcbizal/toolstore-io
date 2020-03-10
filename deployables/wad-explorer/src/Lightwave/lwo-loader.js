import * as THREE from 'three'
import _ from 'lodash'
import loadBMP from './bmp-loader'
import parseUrl from 'url-parse'

import { parseBuffer } from '@toolstore-io/lwo-parser'

const debug = require('debug')('lwo')

THREE.FileLoader.prototype.loadAsync = function(url, onProgress = _.noop) {
  return new Promise((resolve, reject) =>
    this.load(url, resolve, onProgress, reject),
  )
}

function generateTrianglesFromPolygon(poly, ccw = false) {
  const { numvert, vert } = poly
  let triangleIndices = []

  for (let i = 0; i < numvert - 2; i++) {
    if (ccw) {
      triangleIndices.push(vert[0], vert[i + 2], vert[i + 1])
    } else {
      triangleIndices.push(vert[0], vert[i + 1], vert[i + 2])
    }
  }

  return triangleIndices
}

const trimNull = str => str.replace('\u0000', '')

function planarMapUVS(uvs, vertices, indices, size, center, flags) {
  return indices.forEach(index => {
    const vertexIndex = index * 3
    const uvIndex = index * 2

    const x = vertices[vertexIndex] - center.x
    const y = vertices[vertexIndex + 1] - center.y
    const z = vertices[vertexIndex + 2] - center.z

    if (flags.x) uvs.splice(uvIndex, 2, z / size.z + 0.5, y / size.y + 0.5)
    if (flags.y) uvs.splice(uvIndex, 2, x / size.x + 0.5, z / size.z + 0.5)
    if (flags.z) uvs.splice(uvIndex, 2, x / size.x + 0.5, y / size.y + 0.5)
  })
}

async function loadLWO(url) {
  const parsedUrl = parseUrl(url)

  const loader = new THREE.FileLoader()
  loader.setResponseType('arraybuffer')

  const buffer = Buffer.from(await loader.loadAsync(url))
  const lwo = parseBuffer(buffer)

  debug('loaded lwo: %o', lwo)

  const geometry = new THREE.BufferGeometry()

  // TODO: Handle this in lwo-parser. I want just a flat array of floats,
  // not this object { x, y, z } garbage
  const vertices = lwo['PNTS'].reduce(
    (acc, cur) => acc.concat([cur.x, cur.y, cur.z]),
    [],
  )

  const indices = _.chain(lwo['POLS'])
    .groupBy('surf')
    .mapValues(polygons =>
      _.reduce(
        polygons,
        (acc, cur) => acc.concat(generateTrianglesFromPolygon(cur)),
        [],
      ),
    )
    .toPairs()
    .reduce((acc, cur) => {
      const [key, value] = cur
      geometry.addGroup(acc.length, value.length, key - 1)
      return acc.concat(value)
    }, [])
    .value()

  console.log(
    'Mesh:\n' +
      `${vertices.length / 3} verts, ` +
      `${indices.length / 3} tris, ` +
      `${geometry.groups.length} submeshes`,
  )

  const uvs = new Array((vertices.length / 3) * 2).fill(0.0)

  const materials = (_.isArray(lwo['SURF']) ? lwo['SURF'] : [lwo['SURF']]).map(
    (surf, surfIndex) => {
      const { attributes, name } = surf
      const material = new THREE.MeshBasicMaterial()
      material.name = trimNull(name)

      if ('CTEX' in attributes) {
        const ctex = attributes['CTEX']
        if (ctex === 'Planar Image Map\u0000') {
          const group = geometry.groups[surfIndex]

          const { start, count } = group
          const groupIndices = indices.slice(start, start + count)

          planarMapUVS(
            uvs,
            vertices,
            groupIndices,
            attributes['TSIZ'],
            attributes['TCTR'] || new THREE.Vector3(0, 0, 0),
            attributes['TFLG'],
          )
        }
      }

      if ('VTRN' in attributes) {
        const transparency = attributes['VTRN']
        material.opacity = 1 - transparency
        if (transparency > 0) material.transparent = true
      }

      if ('COLR' in attributes) {
        const { red, green, blue } = attributes['COLR']
        material.color = new THREE.Color(`rgb(${red}, ${green}, ${blue})`)
      }

      if ('FLAG' in attributes) {
        const { additive } = attributes['FLAG']
        if (additive) {
          material.transparent = true
          material.blending = THREE.AdditiveBlending
        }
      }

      if ('TIMG' in attributes) {
        const filename = trimNull(
          (Array.isArray(attributes['TIMG'])
            ? attributes['TIMG'].pop()
            : attributes['TIMG']
          )
            .split('\\')
            .pop(),
        )
        if (filename.startsWith('A')) {
          material.transparent = true
          material.alphaTest = 0.5
        }

        const path = _.chain(parsedUrl.pathname)
          .split('/')
          .dropRight()
          .join('/')
          .value()

        loadBMP(`https://wad.toolstore.io${path}/${filename}`).then(texture => {
          material.map = texture
          material.needsUpdate = true
          material.map.wrapS = THREE.RepeatWrapping
          material.map.wrapT = THREE.RepeatWrapping
          material.map.minFilter = THREE.NearestFilter
          material.map.magFilter = THREE.NearestFilter
        })

        material.color = new THREE.Color(0xffffff)
      }

      return material
    },
  )

  geometry.addAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3),
  )
  geometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)

  return new THREE.Mesh(geometry, materials)
}

export default loadLWO
