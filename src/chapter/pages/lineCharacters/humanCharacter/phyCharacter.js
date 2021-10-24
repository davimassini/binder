import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon'

import PointerLockControls from '../../../utils/controls.js'
import Chapter from '../../../chapter'

export default class MainPhyCharacter {
  constructor(_obj3D) {
    this.chapter = new Chapter()
    this.camera = this.chapter.camera

    const { shape, offset } = threeToCannon(_obj3D, { type: ShapeType.BOX })

    this.characterBody = new CANNON.Body({ mass: 10, shape: shape })
    this.characterBody.id = 'SoldierPhy'
    this.characterBody.stats = { hp: 100 }
    this.characterBody.position.y = 15
    this.characterBody.shapeOffsets[0].copy(offset)

    this.setControls()
    this.setStats()
    
  }

  setControls() {
    this.controls = {}

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case ' ':
          this.characterBody.velocity.y = 10
          this.characterBody.velocity.z = 0
          this.characterBody.velocity.x = 0
          break
      }
    })
  }

  setStats() {
    if (this.characterBody.stats.hp) {
      document.querySelector('.app').innerHTML =
      `
        <div class="hp-div">
          <p class="hp-stats">HP: ${this.characterBody.stats.hp}</p>
        </div>
      `
    }
  }
}
