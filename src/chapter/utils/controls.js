import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import Chapter from '../chapter.js'
import MoveCamera from './moveControls/moveCamera.js'

export default class Controls {
  constructor(_options) {
    this.chapter = new Chapter()
    this.time = this.chapter.time
    this.cannon = this.chapter.phisycs.cannon

    this.toggleRun = true
    this.currentAction = ''

    this.setVariables(_options.id)

    this.setControlKey()
    this.setControlEvents()
    this.setConstrolsCollide()

    this.update()
  }

  setVariables(_cannonID) {
    this.cannonBody = this.cannon.bodies.filter(bodyFind => bodyFind.id == _cannonID)[0]
    this.velocity = this.cannonBody.velocity

    this.euler = new THREE.Euler()
    this.quaternion = new THREE.Quaternion()
    this.inputVelocity = new THREE.Vector3()
    this.contactNormal = new CANNON.Vec3()

    this.pitchObject = new THREE.Object3D()
    this.yawObject = new THREE.Object3D()

    this.jumpVelocity = 10
    this.velocityFactor = 1500
    this.upAxis = new CANNON.Vec3(0, 1, 0)
  }

  setControlKey() {
    this.keysBind = {
      moveFoward: ['w', 'ArrowUp'],
      moveBackward: ['s', 'ArrowDown'],
      moveLeft: ['a', 'ArrowLeft'],
      moveRight: ['d', 'ArrowRight'],
      moveJump: ' ',
      moveShift: 'Shift'
    }

    this.moveFoward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.moveJump = true
  }

  setControlEvents() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case this.keysBind.moveFoward[0]:
        case this.keysBind.moveFoward[1]:
          this.moveFoward = true
          break
        case this.keysBind.moveBackward[0]:
        case this.keysBind.moveBackward[1]:
          this.moveBackward = true
          break
        case this.keysBind.moveLeft[0]:
        case this.keysBind.moveLeft[1]:
          this.moveLeft = true
          break
        case this.keysBind.moveRight[0]:
        case this.keysBind.moveRight[1]:
          this.moveRight = true
          break
        case this.keysBind.moveJump:
          if (this.moveJump === true) {
            this.velocity.y = this.jumpVelocity
            this.velocityFactor = 150
          }
          this.moveJump = false
          break
        case this.keysBind.moveShift:
          this.toggleRun = true
          break
      }
    })

    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case this.keysBind.moveFoward[0]:
        case this.keysBind.moveFoward[1]:
          this.moveFoward = false
          break
        case this.keysBind.moveBackward[0]:
        case this.keysBind.moveBackward[1]:
          this.moveBackward = false
          break
        case this.keysBind.moveLeft[0]:
        case this.keysBind.moveLeft[1]:
          this.moveLeft = false
          break
        case this.keysBind.moveRight[0]:
        case this.keysBind.moveRight[1]:
          this.moveRight = false
          break
        case this.keysBind.moveShift:
          this.toggleRun = false
          break
      }
    })

    this.mouseMove = new MoveCamera(this.cannonBody)
  }

  setConstrolsCollide() {
    this.cannonBody.addEventListener("collide", (e) => {
      var contact = e.contact

      if (contact.bi.id == this.cannonBody.id) {
        contact.ni.negate(this.contactNormal)
      } else {
        this.contactNormal.copy(contact.ni)
      }
    })
  }

  update() {
    this.inputVelocity.set(0, 0, 0)

    if (this.moveFoward) {
      this.inputVelocity.z = - this.velocityFactor * this.time.delta
    }

    if (this.moveBackward) {
      this.inputVelocity.z = this.velocityFactor * this.time.delta
    }

    if (this.moveLeft) {
      this.inputVelocity.x = - this.velocityFactor * this.time.delta
    }

    if (this.moveRight) {
      this.inputVelocity.x = this.velocityFactor * this.time.delta
    }

    /** VELOCIDADE COM SHIFT 
    if (this.toggleRun == false) {
      this.velocityFactor = 300
    } else {
      this.velocityFactor = 150
    }
    */

    /** Convert velocity to world coordinates */
    // this.euler.x = pitchObject.rotation.x;
    // this.euler.y = yawObject.rotation.y;
    // this.euler.order = "XYZ";
    // quat.setFromEuler(this.euler);
    // this.inputVelocity.applyQuaternion(this.quaternion)

    this.velocity.x = this.inputVelocity.x
    this.velocity.z = this.inputVelocity.z

    // this.yawObject.position.copy(this.cannonBody.position)

    if (this.cannonBody.position.y < 0.1) {
      this.moveJump = true
      this.velocityFactor = 1500
    }

    if (this.mouseMove) {
      this.mouseMove.update(this.time.elapsed)
    }
  }
}