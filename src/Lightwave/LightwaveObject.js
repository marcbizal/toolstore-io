import React, { Component } from 'react'
import * as THREE from 'three'
// import loadBMP from "./bmp-loader";
import loadLWO from './lwo-loader'

function setCameraDistanceFromMesh(camera, mesh) {
  const geometry = mesh.geometry
  geometry.computeBoundingBox()

  const boundingBox = geometry.boundingBox

  const size = new THREE.Vector3()
  boundingBox.getSize(size)

  const sizeVectorLength = size.length()

  const center = new THREE.Vector3()
  boundingBox.getCenter(center)

  mesh.localToWorld(center)

  camera.position.add(center)
  camera.position.z += sizeVectorLength

  camera.lookAt(center)
}

class LightwaveObject extends Component {
  async componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    //ADD SCENE
    this.scene = new THREE.Scene()

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(width, height)
    this.renderer.sortObjects = true
    this.mount.appendChild(this.renderer.domElement)

    this.lightwave = new THREE.Group()

    const lwo = await loadLWO(this.props.src)

    this.lightwave.add(lwo)

    const axisHelper = new THREE.AxesHelper(20)
    this.lightwave.add(axisHelper)

    this.lightwave.rotation.x = 0.5
    this.lightwave.rotation.y = 0.5
    this.scene.add(this.lightwave)

    setCameraDistanceFromMesh(this.camera, lwo)

    this.start()
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId)
  }

  animate = () => {
    //this.cube.rotation.x += 0.01;
    this.lightwave.rotation.y += 0.01

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        {...this.props}
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}

export default LightwaveObject
