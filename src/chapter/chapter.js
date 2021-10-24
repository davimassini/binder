import * as THREE from 'three'
import cannonDebugger from 'cannon-es-debugger'

import Time from './utils/time.js'
import Sizes from './utils/sizes.js'
import Stats from "./utils/stats.js"

import Resources from "./resources.js"
import Renderer from "./renderer.js"
import Physics from "./physics.js"
import Camera from "./camera.js"
import World from "./world.js"

import assets from './assets.js'

export default class Chapter {
  static instance

  constructor(_options = {}) {

    if (Chapter.instance) { return Chapter.instance }

    Chapter.instance = this

    this.targetElement = _options.targetElement

    if (!this.targetElement) {
      console.log(`Can't find a target element to put that chapter.`)
      return
    }

    this.time = new Time()
    this.sizes = new Sizes()
    this.setConfig()
    this.setStats()
    this.setScene()
    this.setCamera()
    this.setRenderer()
    this.setResources()
    this.setPhysics()
    this.setWorld()

    this.sizes.on('resize', () => { this.resize() })

    this.update()

    cannonDebugger(this.scene, this.phisycs.cannon.bodies, { color: "orange" })
  }

  setConfig() {
    this.config = {}

    this.config.debug = window.location.hash === "#debug"

    const boundings = this.targetElement.getBoundingClientRect()
    this.config.width = boundings.width
    this.config.height = boundings.height || window.innerHeight
  }

  setStats() {
    if (this.config.debug) { this.setStats = new Stats(true) }
  }

  setScene() {
    this.scene = new THREE.Scene()
  }

  setCamera() {
    this.camera = new Camera()
  }

  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance })
    this.targetElement.appendChild(this.renderer.instance.domElement)
  }

  setResources() {
    this.resources = new Resources(assets)
  }

  setPhysics() {
    const physicsOptions = {}
    physicsOptions.useGravity = [0, -9.82, 0]
    physicsOptions.dCM = { friction: 0, cES: 1e7, cER: 4 }

    this.phisycs = new Physics(physicsOptions)
  }

  setWorld() {
    this.world = new World()
  }

  update() {
    if (this.stats) { this.stats.update() }

    this.camera.update()

    if (this.world) {
      this.world.update()
    }

    if (this.phisycs) {
      this.phisycs.update()
    }

    if (this.renderer) {
      this.renderer.update()
    }

    // Refatorar para um arquivo específico
    if (this.world.scene.getObjectByName('SoldierObj')) {
      if (this.phisycs.cannon.getBodyById('SoldierPhy')) {
        this.world.scene.getObjectByName('SoldierObj').position.copy(this.phisycs.cannon.getBodyById('SoldierPhy').position)
        this.world.scene.getObjectByName('SoldierObj').quaternion.copy(this.phisycs.cannon.getBodyById('SoldierPhy').quaternion)

        // this.phisycs.cannon.getBodyById('SoldierPhy').position.x = Math.cos(-(this.time.elapsed) * 0.32) * 5
        // this.phisycs.cannon.getBodyById('SoldierPhy').position.z = Math.sin(-(this.time.elapsed) * 0.32) * 5
      }
    }


    window.requestAnimationFrame(() => {
      this.update()
    })
  }

  resize() {
    const boundings = this.targetElement.getBoundingClientRect()
    this.config.width = boundings.width
    this.config.height = boundings.height

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    if (this.camera) {
      this.camera.resize()
    }

    if (this.renderer) {
      this.renderer.resize()
    }

    if (this.world) {
      this.world.resize()
    }
  }

  destroy() { }
}
