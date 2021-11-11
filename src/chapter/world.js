import * as THREE from 'three'
import Chapter from './chapter.js'

import MainObjCharacter from './pages/lineCharacters/humanCharacter/objCharacter.js'
import FoxObjCharacter from './pages/lineCharacters/foxCharacter/objCharacter.js'

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
        // this.setFoxCharacter()
        // this.setBear()
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
    this.resources.items.checkerBoard8x8.repeat.set(100, 100)
    this.resources.items.checkerBoard8x8.wrapS = THREE.RepeatWrapping
    this.resources.items.checkerBoard8x8.wrapT = THREE.RepeatWrapping
    this.resources.items.checkerBoard8x8.minFilter = THREE.NearestFilter
    this.resources.items.checkerBoard8x8.magFilter = THREE.NearestFilter

    const floorObj = new THREE.Mesh(
      new THREE.BoxGeometry(200, 200, 0.1),
      new THREE.MeshBasicMaterial({ map: this.resources.items.checkerBoard8x8})
    )
    floorObj.rotation.x = Math.PI * 0.5

    floorObj.receiveShadow = true

    this.scene.add(floorObj)
  }

  setMainCharacter() {
    this.mainObjCharacter = new MainObjCharacter()
    this.scene.add(this.mainObjCharacter.object.scene)
  }

  setFoxCharacter() {
    this.foxObjCharacter = new FoxObjCharacter()
    this.scene.add(this.foxObjCharacter.object.scene)
  }

  setBear() {
    const modeloUrso = this.resources.items.modeloUrso
    
    modeloUrso.scene.name = 'modeloUrso'
    modeloUrso.scene.scale.set(0.5, 0.5, 0.5)
    modeloUrso.scene.rotation.y = Math.PI * 1.5
    modeloUrso.scene.position.z = -2
    modeloUrso.scene.position.y = 0.03

    this.scene.add(modeloUrso.scene)
  }

  resize() { }

  update() {
    if(this.mainObjCharacter) {
      this.mainObjCharacter.update()
    }

    if(this.foxObjCharacter) {
      this.foxObjCharacter.update()
    }
  }

  destroy() { }
}
