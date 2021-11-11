import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import gsap from 'gsap'

import Chapter from '../../chapter'

export default class MoveCamera {
  constructor(_options) {
    this.cannonBody = _options

    this.chapter = new Chapter()
    this.camera = this.chapter.camera.modes.default.instance
    this.instance = this.chapter.renderer.instance

    this.currentPosition = new THREE.Vector3()
    this.currentLookat = new THREE.Vector3()

    // this.pitchObject = new THREE.Object3D()
    this.yawObject = new THREE.Object3D()
    this.euler = new THREE.Euler()

    this.rotQuat = new CANNON.Quaternion()
    this.rotVec3 = new CANNON.Vec3(0, 1, 0)
    this.rotCtrl = this.cannonBody.quaternion.clone()

    this.mouseSensitivity = 0.001

    this.eventListerners()

    this.setVariables()
  }

  setVariables() {
    this.rotV3 = {}
    this.rotV3.x = 0.1
    this.rotV3.y = 2
    this.rotV3.z = 1.75
    
    this.quatV3 = {}
    this.quatV3.x = 0.1
    this.quatV3.y = 1.5
    this.quatV3.z = -1.2

    const folderOffset = this.chapter.gui.addFolder('Offset')
    const folderLookat = this.chapter.gui.addFolder('LookAt')
    
    folderOffset.add(this.rotV3, 'x').min(-10).max(10).step(0.01).name('rotV3X')
    folderOffset.add(this.rotV3, 'y').min(-10).max(10).step(0.01).name('rotV3Y')
    folderOffset.add(this.rotV3, 'z').min(-10).max(10).step(0.01).name('rotV3Z')
    
    folderLookat.add(this.quatV3, 'x').min(-10).max(10).step(0.01).name('quatV3X')
    folderLookat.add(this.quatV3, 'y').min(-10).max(10).step(0.01).name('quatV3Y')
    folderLookat.add(this.quatV3, 'z').min(-10).max(10).step(0.01).name('quatV3Z')
  }

  calculateIdealOffset() {
    if (this.chapter.phisycs.mainPhyCharacter.controls) {
      if (this.chapter.phisycs.mainPhyCharacter.controls.velocity.z != 0) {
        gsap.to(this.rotV3, { duration: 2, delay: 0, z: 2.5 })
      } else {
        gsap.to(this.rotV3, { duration: 1.5, delay: 0, z: 1.75 })
      }

      if (this.chapter.phisycs.mainPhyCharacter.characterBody.position.y > 0.1) {
        gsap.to(this.rotV3, { duration: 1, delay: 0, y: 2.5 })
        
        if (this.chapter.phisycs.mainPhyCharacter.controls.velocity.y < 0) {
          gsap.to(this.rotV3, { duration: 3, delay: 0, y: 2 })
        }
      } else {
        gsap.to(this.rotV3, { duration: 0.25, delay: 0, y: 2 })
      }
    }

    const idealOffset = new THREE.Vector3(this.rotV3.x, this.rotV3.y, this.rotV3.z)
    idealOffset.applyQuaternion(this.cannonBody.quaternion)
    idealOffset.add(this.cannonBody.position)
    return idealOffset
  }

  calculateIdealLookat() {
    const idealLookat = new THREE.Vector3(this.quatV3.x, this.quatV3.y, this.quatV3.z)
    idealLookat.applyQuaternion(this.cannonBody.quaternion)
    idealLookat.add(this.cannonBody.position)
    return idealLookat
  }

  eventListerners() {
    document.addEventListener('mousemove', e => this.onMouseMove(e), false)
  }

  onMouseMove(_event) {
    if (document.pointerLockElement === this.instance.domElement) {
      const mousePosX = _event.movementX || _event.mozMovementX || _event.webkitMovementX || 0
      const mousePosY = _event.movementY || _event.mozMovementY || _event.webkitMovementY || 0

      if (mousePosX) {
        if (mousePosX < 0) {
          this.rotQuat.setFromAxisAngle(this.rotVec3, -mousePosX * this.mouseSensitivity)
          this.rotCtrl.mult(this.rotQuat, this.rotCtrl)
        } else {
          this.rotQuat.setFromAxisAngle(this.rotVec3, -mousePosX * this.mouseSensitivity)
          this.rotCtrl.mult(this.rotQuat, this.rotCtrl)
        }
        this.yawObject.rotation.y -= mousePosX * this.mouseSensitivity
        this.euler.y = this.yawObject.rotation.y

        this.cannonBody.quaternion.copy(this.rotCtrl)
      }
    }
  }

  update(_time) {
    const idealOffset = this.calculateIdealOffset()
    const idealLookat = this.calculateIdealLookat()
    const t = 1.0 - Math.pow(0.001, _time)

    this.currentPosition.lerp(idealOffset, t)
    this.currentLookat.lerp(idealLookat, t)

    this.camera.position.copy(this.currentPosition)
    this.camera.lookAt(this.currentLookat)
  }
}
