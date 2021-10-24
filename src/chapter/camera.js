import * as THREE from 'three'
import Chapter from './chapter.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
  constructor(_options) {
    this.chapter = new Chapter()
    this.config = this.chapter.config
    this.debug = this.chapter.debug
    this.time = this.chapter.time
    this.sizes = this.chapter.sizes
    this.targetElement = this.chapter.targetElement
    this.scene = this.chapter.scene

    this.mode = 'debug' // defaultCamera \ debugCamera

    this.setInstance()
    this.setModes()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(75, this.config.width / this.config.height, 0.1, 100)
// this.instance.rotation.reorder('YXZ')

    this.scene.add(this.instance)
  }

  setModes() {
    this.modes = {}

    this.modes.default = {}
    this.modes.default.instance = this.instance.clone()
    // this.modes.default.instance.rotation.reorder('YXZ')

    this.modes.debug = {}
    this.modes.debug.instance = this.instance.clone()
    // this.modes.debug.instance.rotation.reorder('YXZ')
    this.modes.debug.instance.position.set(8, 12, 8)

    this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
    this.modes.debug.orbitControls.enabled = this.modes.debug.active
    this.modes.debug.orbitControls.screenSpacePanning = true
    this.modes.debug.orbitControls.enableKeys = false
    this.modes.debug.orbitControls.zoomSpeed = 0.25
    this.modes.debug.orbitControls.enabledDamping = true
    this.modes.debug.orbitControls.update()
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height
    this.instance.updateProjectionMatrix()

    this.modes.default.instance.aspect = this.config.width / this.config.height
    this.modes.default.instance.updateProjectionMatrix()

    this.modes.debug.instance.aspect = this.config.width / this.config.height
    this.modes.debug.instance.updateProjectionMatrix()
  }

  update() {
    this.modes.debug.orbitControls.update()

    this.instance.position.copy(this.modes[this.mode].instance.position)
    this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
    this.instance.updateMatrixWorld()
  }

  destroy() {
    this.modes.debug.orbitControls.destroy()
  }
}
