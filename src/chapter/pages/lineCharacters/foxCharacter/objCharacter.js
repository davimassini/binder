import * as THREE from 'three'
import Chapter from '../../../chapter'

export default class ObjCharacter {
  constructor(_options) {
    this.chapter = new Chapter()
    this.resources = this.chapter.resources

    this.loadModel()
    this.setControls()
    this.setAnimations()
  }

  loadModel() {
    if (this.resources.items.foxAnimal) {
      this.object = this.resources.items.foxAnimal

      /*************WIREFRAME*************
      * this.object.scene.traverse((node) => {
      *   if (!node.isMesh) return;
      *   node.material.wireframe = true
      * })
      ***********************************/

      this.object.scene.name = 'FoxObj'
      this.object.scene.scale.set(0.01, 0.01, 0.01)
    }
  }

  setAnimations() {
    this.mixer = new THREE.AnimationMixer(this.object.scene)
    this.actualState = this.mixer.clipAction(this.object.animations[2])
    this.actualState.setEffectiveTimeScale(2)
    this.actualState.play()
  }

  setControls() {
  }

  update() {
    if (this.mixer != null) {
      this.mixer.update(this.chapter.time.delta)
    }
  }
}
