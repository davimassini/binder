import * as CANNON from 'cannon-es'
import { threeToCannon, ShapeType } from 'three-to-cannon'

import Controls from '../../../utils/controls.js'
import Chapter from '../../../chapter'

export default class MainPhyCharacter {
  constructor(_obj3D) {
    this.chapter = new Chapter()
    this.scene = this.chapter.scene
    this.cannon = this.chapter.phisycs.cannon
    this.camera = this.chapter.camera

    const { shape, offset } = threeToCannon(_obj3D, { type: ShapeType.BOX })

    this.characterBody = new CANNON.Body({ mass: 1500, shape: shape })
    this.characterBody.id = 'SoldierPhy'
    this.characterBody.shapeOffsets[0].copy(offset)

    this.setStats()
    this.setControls()
    // this.setScreenStats()
  }

  setStats() {
    this.characterBody.stats = {}
    this.characterBody.stats.hp = 100

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
    setTimeout(() => {
      this.controls = new Controls(this.characterBody)
    }, 600)
  }

  /** UTILIZAR
  setScreenStats() {
    if (this.characterBody.stats.hp) {
      console.log(this.characterBody.stats.hp)
      document.querySelector('.app').innerHTML =
        `
        <div class="hp-div">
          <p class="hp-stats">HP: ${this.characterBody.stats.hp}</p>
        </div>
      `
    }
  }

  removeMainCharacter() {
    // ARRUMAR P N USAR MAIS TIMEOUT
    if (this.scene.getObjectByName('SoldierObj')) {
      if (this.characterBody) {
        this.scene.remove(this.scene.getObjectByName('SoldierObj'))
        this.cannon.removeBody(this.characterBody)
      }
    }

    document.querySelector('.app').innerHTML =
    `
        <div class="death-msg">
            <p>GAME OVER</p>
            <div class="buttonRestart">
              <a href="#">Restart game</a>
            </div>
        </div>
    `

    document.querySelector('.buttonRestart').addEventListener('click', () => {
        window.location.reload(true)
    })

    return
  }
  */

  update() {
    if (this.controls) {
      this.controls.update()
    }

    // TEMPORARIO
    if (this.characterBody.position.y < -10) {
      window.location.reload(true)
    }
  }
}
