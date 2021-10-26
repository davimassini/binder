import * as THREE from 'three'
import Chapter from './chapter.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

export default class Renderer {
  constructor(_options = {}) {
    this.chapter = new Chapter()
    this.config = this.chapter.config
    this.debug = this.chapter.debug
    this.stats = this.chapter.stats
    this.time = this.chapter.time
    this.sizes = this.chapter.sizes
    this.scene = this.chapter.scene
    this.camera = this.chapter.camera

    this.usePostprocess = false

    this.setInstance()
    this.setPostProcess()
    this.setEventListener()
  }

  setInstance() {
    this.clearColor = '#262837'

    this.instance = new THREE.WebGLRenderer({ alpha: false, antialias: false }) // Antialias changed to false
    this.instance.domElement.style.position = 'absolute'
    this.instance.domElement.style.top = 0
    this.instance.domElement.style.left = 0
    this.instance.domElement.style.width = '100%'
    this.instance.domElement.style.height = '100%'

    this.instance.setClearColor(this.clearColor, 1)
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    this.context = this.instance.getContext()

    if (this.stats) { this.stats.setRenderPanel(this.context) }
  }

  setPostProcess() {
    this.postProcess = {}

    this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

    const RenderTargetClass = this.config.pixelRatio >= 2 ? THREE.WebGLRenderTarget : THREE.WebGLMultisampleRenderTarget
    this.renderTarget = new RenderTargetClass(
      this.config.width,
      this.config.height,
      {
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        encoding: THREE.sRGBEncoding
      }
    )
    this.postProcess.composer = new EffectComposer(this.instance, this.renderTarget)
    this.postProcess.composer.setSize(this.config.width, this.config.height)
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

    this.postProcess.composer.addPass(this.postProcess.renderPass)
  }

  setEventListener() {
    window.addEventListener('dblclick', () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
      this.instance.domElement.requestPointerLock = this.instance.domElement.requestPointerLock || this.instance.domElement.mozRequestPointerLock
      this.instance.domElement.requestPointerLock()

      if (!fullscreenElement) {
        if (this.instance.domElement.requestFullscreen) {
          this.instance.domElement.requestFullscreen()
        } else if (this.instance.domElement.webkitRequestFullscreen) {
          this.instance.domElement.webkitRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen()) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen()) {
          document.webkitExitFullscreen()
        }
      }
    })
  }

  resize() {
    this.instance.setSize(this.config.width, this.config.height)
    this.instance.setPixelRatio(this.config.pixelRatio)

    this.postProcess.composer.setSize(this.config.width, this.config.height)
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender()
    }

    if (this.usePostprocess) {
      this.postProcess.composer.render()
    } else {
      this.instance.render(this.scene, this.camera.instance)
    }

    if (this.stats) {
      this.stats.afterRender()
    }
  }

  destroy() {
    this.instance.renderLists.dispose()
    this.instance.dispose()
    this.renderTarget.dispose()
    this.postProcess.composer.renderTarget1.dispose()
    this.postProcess.composer.renderTarget2.dispose()
  }
}
