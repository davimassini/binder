import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon'

import Controls from '../../../utils/controls.js'
import Chapter from '../../../chapter'

export default class MainPhyCharacter {
  constructor(_obj3D) {
    this.chapter = new Chapter()
    this.camera = this.chapter.camera

    const { shape, offset } = threeToCannon(_obj3D, { type: ShapeType.BOX })

    this.characterBody = new CANNON.Body({ mass: 150, shape: shape })
    this.characterBody.id = 'SoldierPhy'
    this.characterBody.shapeOffsets[0].copy(offset)

    this.setStats()
    this.setControls()
  }

  setStats() {
    this.characterBody.stats = { hp: 100 }

    if (this.characterBody.stats.hp) {
      document.querySelector('.app').innerHTML =
      `
        <div class="hp-div">
          <p class="hp-stats">HP: ${this.characterBody.stats.hp}</p>
        </div>
      `
    }
  }

  setControls() {
    setTimeout(() =>  {
      this.controls = new Controls(this.characterBody)
    }, 600)
  }

  update() {
    if (this.controls) { 
      this.controls.update()
    }
  }
}
