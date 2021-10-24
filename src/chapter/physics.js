import * as CANNON from 'cannon-es'
import Chapter from './chapter.js'

import MainPhyCharacter from './pages/lineCharacters/humanCharacter/phyCharacter.js'

export default class Physics {
  constructor(_options) {
    this.chapter = new Chapter()
    this.config = this.chapter.config
    this.resources = this.chapter.resources
    this.scene = this.chapter.scene

    this.cannon = new CANNON.World()
    this.cannon.broadphase = new CANNON.SAPBroadphase(this.cannon)
    this.cannon.gravity = new CANNON.Vec3(_options.useGravity[0], _options.useGravity[1], _options.useGravity[2])
    this.cannon.defaultContactMaterial.friction = _options.dCM.friction
    this.cannon.defaultContactMaterial.contactEquationStiffness = _options.dCM.cES
    this.cannon.defaultContactMaterial.contactEquationRelaxation = _options.dCM.cER
    this.cannon.allowSleep = false

    this.resources.on('groupEnd', (_group) => {
      if (_group.name === 'baseWorld') {
        this.setFloor()
        // this.setRandomBox(20)
        this.setCollideEvents()
      }

      if (_group.name === 'mainCharacter') {
        this.setMainCharacter()
      }
    })
  }

  setFloor() {
    const phyFloorShape = new CANNON.Box(new CANNON.Vec3(10, 10, 0.05))
    const phyFloorBody = new CANNON.Body({
      mass: 0, shape: phyFloorShape
    })
    phyFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
    phyFloorBody.id = 'floorPhy'

    this.cannon.addBody(phyFloorBody)
  }

  setRandomBox(boxCount) {
    for (let i = 0; i < boxCount; i++) {
      const randomlyMath = Math.random()

      const phyFloorShape = new CANNON.Box(new CANNON.Vec3(
        randomlyMath * 0.5,
        randomlyMath * 0.5,
        randomlyMath * 0.5
      ))

      const phyFloorBody = new CANNON.Body({
        mass: 1500, shape: phyFloorShape
      })

      phyFloorBody.position.y = Math.random() * 10
      phyFloorBody.position.x = (Math.random() - 0.5) * 10
      phyFloorBody.position.z = (Math.random() - 0.5) * 10

      this.cannon.addBody(phyFloorBody)
    }
  }

  setCollideEvents() {
    this.cannon.bodies.map(e => {
      if (!(e.id === 'floorPhy')) {
        e.addEventListener('collide', (a) => {
          if (a.body.id === 'SoldierPhy') {
            if (a.body.stats.hp) {
              a.body.stats.hp = a.body.stats.hp == 0 ? 0 : a.body.stats.hp - 10

              if (document.querySelector('.hp-stats')) {
                document.querySelector('.hp-stats').innerHTML = `HP: ${a.body.stats.hp}`
              }

              if (a.body.stats.hp == 0) {
                this.removeMainCharacter()
              }
            }
          }
        })
      }
    })
  }

  setMainCharacter() {
    // ARRUMAR P N USAR MAIS TIMEOUT - talvez jogar obrigação de if pra cima
    setTimeout(() => {
      if (this.scene.getObjectByName('SoldierObj')) {
        const thisObj = this.scene.getObjectByName('SoldierObj')

        this.boxPhyCharacter = new MainPhyCharacter(thisObj)
        this.cannon.addBody(this.boxPhyCharacter.characterBody)
      }
    }, 400)
  }

  removeMainCharacter() {
    // ARRUMAR P N USAR MAIS TIMEOUT
    setTimeout(() => {
      if (this.scene.getObjectByName('SoldierObj')) {
        if (this.cannon.getBodyById('SoldierPhy')) {
          this.scene.remove(this.scene.getObjectByName('SoldierObj'))
          this.cannon.removeBody(this.cannon.getBodyById('SoldierPhy'))
        }
      }
    }, 100)

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

  resize() { }

  update() {
    this.cannon.step(1 / 60, this.chapter.time.delta, 3)
  }

  destroy() { }
}
