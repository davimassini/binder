import * as THREE from 'three'

import Chapter from '../../../chapter'
import Animations from '../../../utils/animations'

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

      /*************SHADOWS*************/
      this.object.scene.traverse((node) => {
        if (!node.isMesh) return;
        node.castShadow = true
      })
      /***********************************/

      this.object.scene.name = 'SoldierObj'
      // this.object.scene.scale.set(0.4, 0.4, 0.4)
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
          <div class="input-title">Walk</div>
          <div class="input-key">J</div>
        </div>
    `

    document.querySelector('body').appendChild(newDiv)
  }

  setAnimations() {
    this.animations = new Animations(this.object)
  }

  setCameraControl() { }

  update() {
    if(this.animations) {
      this.animations.update()
    }
  }
}
