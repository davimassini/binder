import * as THREE from 'three'
import Chapter from '../../../chapter'

export default class MainObjCharacter {
  constructor(_options) {
    this.chapter = new Chapter()
    this.resources = this.chapter.resources

    this.loadModel()
    this.setControls()
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

      this.object.scene.name = 'SoldierBoy'
      this.object.scene.scale.set(0.02, 0.02, 0.02)
    }
  }

  setControls() { }
}
