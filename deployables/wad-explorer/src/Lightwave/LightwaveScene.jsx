import React, { useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { loadLightwaveScene } from './lws-loader'

export const LightwaveScene = ({ src }) => {
  const [scene, setScene] = useState(null)
  const { camera } = useThree()

  useEffect(() => {
    if (scene) {
      const bbox = new THREE.Box3().setFromObject(scene)

      camera.position.copy(bbox.getSize())
      camera.lookAt(new THREE.Vector3(0, 0, 0))
    }
  }, [scene])

  useEffect(() => {
    loadLightwaveScene(src).then(setScene)
  }, [src])

  const mixer = useMemo(() => scene && new THREE.AnimationMixer(scene), [scene])

  useEffect(() => {
    if (mixer) {
      console.log(scene.animations)
      const clip = THREE.AnimationClip.findByName(scene.animations, 'lwo_anim')
      const action = mixer.clipAction(clip)

      console.log(clip, action)

      action.play()
    }
  }, [mixer])

  useFrame((_, delta) => {
    mixer && mixer.update(delta)
  })

  return (
    <primitive object={scene || new THREE.AxesHelper(5)} position={[0, 0, 0]} />
  )
}

export default ({ src }) => (
  <Canvas
    pixelRatio={window.devicePixelRatio}
    camera={new THREE.Camera().translateZ(30)}
  >
    <gridHelper args={[120, 12]} />
    <LightwaveScene src={src} />
  </Canvas>
)
