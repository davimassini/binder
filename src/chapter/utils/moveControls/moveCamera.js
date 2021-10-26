import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import Chapter from '../../chapter'

export default class MoveCamera {
  constructor(_options) {
    this.cannonBody = _options

    this.chapter = new Chapter()
    this.camera = this.chapter.camera.modes.default.instance

    this.currentPosition = new THREE.Vector3()
    this.currentLookat = new THREE.Vector3()

    this.rotQuat = new CANNON.Quaternion()
    this.rotVec3 = new CANNON.Vec3(0, 1, 0)
    this.rotCtrl = this.cannonBody.quaternion.clone()

    this.mouseSensitivity = 0.001

    this.eventListerners()
  }

  calculateIdealOffset() {
    const idealOffset = new THREE.Vector3(0, 3, 2)
    idealOffset.applyQuaternion(this.cannonBody.quaternion)
    idealOffset.add(this.cannonBody.position)
    return idealOffset
  }

  calculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 2, 0)
    idealLookat.applyQuaternion(this.cannonBody.quaternion)
    idealLookat.add(this.cannonBody.position)
    return idealLookat
  }

  eventListerners() {
    document.addEventListener('mousemove', e => this.onMouseMove(e), false)
  }

  onMouseMove(_event) {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const mousePosX = _event.movementX || _event.mozMovementX || _event.webkitMovementX || 0

      if (mousePosX) {
        if (mousePosX < 0) {
          this.rotQuat.setFromAxisAngle(this.rotVec3, -mousePosX * this.mouseSensitivity)
          this.rotCtrl.mult(this.rotQuat, this.rotCtrl)
        } else {
          this.rotQuat.setFromAxisAngle(this.rotVec3, -mousePosX * this.mouseSensitivity)
          this.rotCtrl.mult(this.rotQuat, this.rotCtrl)
        }
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
