import * as THREE from 'three'
import Chapter from '../../../chapter'

export default class MainObjCharacter {
  constructor(_options) {
    this.chapter = new Chapter()
    this.camera = this.chapter.camera.instance
    this.resources = this.chapter.resources

    this.loadModel()
    this.setControls()
    this.setAnimations()
  }

  loadModel() {
    if (this.resources.items.soldierBoy) {
      this.object = this.resources.items.soldierBoy

      /*************WIREFRAME*************
      * this.object.scene.traverse((node) => {
      *   if (!node.isMesh) return;
      *   node.material.wireframe = true
      * })
      ***********************************/

      this.object.scene.name = 'SoldierObj'
    }
  }

  setControls() {
    
    const newDiv = document.createElement('div')
    newDiv.setAttribute('class', 'controls')

    newDiv.innerHTML = 
    `
        <div class="control-input">
          <div class="input-title">Idle</div>
          <div class="input-key">G</div>
        </div>
        <div class="control-input">
          <div class="input-title">Run</div>
          <div class="input-key">H</div>
        </div>
        <div class="control-input">
          <div class="input-title">T-Pose</div>
          <div class="input-key">J</div>
        </div>
        <div class="control-input">
          <div class="input-title">Walk</div>
          <div class="input-key">K</div>
        </div>
    `

    document.querySelector('body').appendChild(newDiv)
  }

  setAnimations() {
    this.mixer = new THREE.AnimationMixer(this.object.scene)
    let action

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'g':
          if (action != null) { action.stop() }
          action = this.mixer.clipAction(this.object.animations[0])
          action.play()
          break
        case 'h':
          if (action != null) { action.stop() }
          action = this.mixer.clipAction(this.object.animations[1])
          action.play()
          break
        case 'j':
          if (action != null) { action.stop() }
          action = this.mixer.clipAction(this.object.animations[2])
          action.play()
          break
        case 'k':
          if (action != null) { action.stop() }
          action = this.mixer.clipAction(this.object.animations[3])
          action.play()
          break
      }
    })
  }

  setCameraControl() { }

  update() {
    if(this.mixer != null){
      this.mixer.update(this.chapter.time.delta)
    }
  }
}
