import * as THREE from 'three'
import Chapter from './chapter.js'

import MainObjCharacter from './pages/lineCharacters/humanCharacter/objCharacter.js'

export default class World {
  constructor(_options) {
    this.chapter = new Chapter()
    this.config = this.chapter.config
    this.camera = this.chapter.camera.instance
    this.scene = this.chapter.scene
    this.resources = this.chapter.resources

    this.setLight()

    this.resources.on('groupEnd', (_group) => {
      if (_group.name === 'baseWorld') {
        this.setFloor()
      }

      if (_group.name === 'mainCharacter') {
        this.setMainCharacter()
      }
    })
  }

  setLight() {
    // do this in a external file broooooo
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)

    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = -7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = -7
    directionalLight.position.set(5, 5, 5)

    this.scene.add(ambientLight, directionalLight)
  }

  setFloor() {
    const floorObj = new THREE.Mesh(
      new THREE.BoxGeometry(20, 20, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    floorObj.rotation.x = Math.PI * 0.5

    this.scene.add(floorObj)
  }

  setMainCharacter() {
    this.boxObjCharacter = new MainObjCharacter()
    this.scene.add(this.boxObjCharacter.object.scene)
  }

  resize() { }

  update() {
    if(this.boxObjCharacter) {
      this.boxObjCharacter.update()
    }
  }

  destroy() { }
}
