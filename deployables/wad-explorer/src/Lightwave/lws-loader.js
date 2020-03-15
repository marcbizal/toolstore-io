import * as THREE from 'three'
import {
  InterpolateKochanekBartels,
  InterpolateMixed,
  PatchedKeyframeTrack,
} from './three/PatchedKeyframeTrack'
import _ from 'lodash'
import loadLWO from './lwo-loader'
const debug = require('debug')('lws')

const degreesToRadians = degrees => degrees * (Math.PI / 180)

export async function loadLightwaveScene(url) {
  const lws = await fetch(url).then(response => response.text())

  const lines = lws
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.split(' '))

  const nodes = []
  const tracks = []
  let currentNode = null
  let version = 0
  let first = 0
  let last = 60
  let fps = 25

  for (let i = 0; i < lines.length; i++) {
    const currentLine = () => lines[i]
    const nextLine = () => lines[++i]
    const seek = n => (i += n)

    const [command, ...tokens] = currentLine()
    switch (command) {
      case 'LWSC': {
        const [_version] = nextLine()
        version = _version

        debug(`LWS file format version is ${version}`)
        break
      }
      case 'FirstFrame': {
        const [_first] = tokens
        first = parseInt(_first)
        break
      }
      case 'LastFrame': {
        const [_last] = tokens
        last = parseInt(_last)
        break
      }
      case 'FramesPerSecond': {
        const [_fps] = tokens
        fps = parseFloat(_fps)
        break
      }
      case 'LoadObject': {
        const [_path] = tokens
        const basename = _path.split('\\').pop()
        const matches = await fetch(
          `https://wad.toolstore.io/rel?find=${basename}`,
        ).then(response => response.json())

        const object = await loadLWO(
          `https://wad.toolstore.io/rel/${matches[0].path}`,
        )

        object.name = basename.replace('.lwo', '')

        nodes.push(object)
        currentNode = object
        break
      }
      case 'AddNullObject': {
        const [_name] = tokens

        const group = new THREE.Group()
        group.name = _name

        nodes.push(group)
        currentNode = group
        break
      }
      case 'ObjectMotion': {
        const [_numChannels] = nextLine()
        const [_numKeyframes] = nextLine()

        const keyframeTimes = []
        const positionKeyframes = []
        const rotationKeyframes = []
        const scaleKeyframes = []

        for (let i = 0; i < _numKeyframes; i++) {
          const [
            xPosition,
            yPosition,
            zPosition,
            heading,
            pitch,
            bank,
            xScale,
            yScale,
            zScale,
          ] = nextLine().map(s => parseFloat(s))

          const [
            frameNumber,
            linearValue,
            tension,
            continuity,
            bias,
          ] = nextLine().map(s => parseFloat(s))

          keyframeTimes.push(frameNumber / fps)
          positionKeyframes.push(
            xPosition,
            yPosition,
            zPosition,
            linearValue === 0
              ? InterpolateKochanekBartels
              : THREE.InterpolateLinear,
            tension,
            continuity,
            bias,
          )
          rotationKeyframes.push(
            ...new THREE.Quaternion()
              .setFromEuler(
                new THREE.Euler(
                  degreesToRadians(pitch),
                  degreesToRadians(heading),
                  degreesToRadians(bank),
                ),
              )
              .toArray(),
            linearValue === 0
              ? InterpolateKochanekBartels
              : THREE.InterpolateLinear,
            tension,
            continuity,
            bias,
          )
          scaleKeyframes.push(
            xScale,
            yScale,
            zScale,
            linearValue === 0
              ? InterpolateKochanekBartels
              : THREE.InterpolateLinear,
            tension,
            continuity,
            bias,
          )
        }

        tracks.push(
          new PatchedKeyframeTrack(
            `${currentNode.uuid}.position`,
            keyframeTimes,
            positionKeyframes,
            InterpolateMixed,
          ),
        )
        tracks.push(
          new PatchedKeyframeTrack(
            `${currentNode.uuid}.quaternion`,
            keyframeTimes,
            rotationKeyframes,
            InterpolateMixed,
          ),
        )
        tracks.push(
          new THREE.VectorKeyframeTrack(
            `${currentNode.uuid}.scale`,
            keyframeTimes,
            scaleKeyframes,
            InterpolateMixed,
          ),
        )
        break
      }
      case 'ObjDissolve': {
        const [_arg] = tokens
        if (_arg === '(envelope)') {
          const [_numChannels] = nextLine()
          const [_numKeyframes] = nextLine()

          const keyframeTimes = []
          const envelopeKeyframes = []
          for (let i = 0; i < _numKeyframes; i++) {
            const [envelopeValue] = nextLine().map(s => parseFloat(s))

            const [
              frameNumber,
              linearValue,
              tension,
              continuity,
              bias,
            ] = nextLine().map(s => parseFloat(s))

            keyframeTimes.push(frameNumber / fps)
            envelopeKeyframes.push(1 - envelopeValue)
          }

          currentNode.userData.opacity = 1.0
          currentNode.onBeforeRender = function(
            renderer,
            scene,
            camera,
            geometry,
            material,
            group,
          ) {
            material.transparent = this.userData.opacity < 1
            material.opacity = this.userData.opacity
          }

          tracks.push(
            new THREE.NumberKeyframeTrack(
              `${currentNode.uuid}.userData[opacity]`,
              keyframeTimes,
              envelopeKeyframes,
            ),
          )
        }
        break
      }
      case 'ParentObject': {
        const [_parent] = tokens
        currentNode.userData = { parent: parseInt(_parent) - 1 }
        break
      }
      default: {
        debug(`Lightwave Scene command not recognised: ${command}`)
      }
    }
  }

  nodes.forEach(
    node => node.userData.parent && nodes[node.userData.parent].add(node),
  )

  const rootNodes = nodes.filter(node => !node.parent)

  debug(`Loaded LWS Scene with ${rootNodes.length} root nodes:`, rootNodes)

  const scene = new THREE.Group()

  scene.add(...rootNodes)
  scene.animations = [
    new THREE.AnimationClip('lwo_anim', (last - first) / fps, tracks)
      .optimize()
      .resetDuration(),
  ]

  return scene
}
