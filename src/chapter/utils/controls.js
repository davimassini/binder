import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import Chapter from '../chapter.js'
import MoveCamera from './moveControls/moveCamera.js'
import GamepadControls from './gamepadControls.js'

export default class Controls {
  constructor(_options) {
    this.chapter = new Chapter()
    this.time = this.chapter.time
    this.cannon = this.chapter.phisycs.cannon
    this.camera = this.chapter.camera.modes.default.instance

    this.toggleRun = false
    this.currentAction = ''

    this.setVariables(_options.id)

    this.setControlKey()
    this.setGamepadControl()
    this.setControlEvents()
    this.setConstrolsCollide()

    this.update()
  }

  setVariables(_cannonID) {
    this.cannonBody = this.cannon.bodies.filter(bodyFind => bodyFind.id == _cannonID)[0]
    this.velocity = this.cannonBody.velocity

    this.animationsBody = this.chapter.world.mainObjCharacter.animations

    this.euler = new THREE.Euler()
    this.quaternion = new THREE.Quaternion()
    this.inputVelocity = new THREE.Vector3()
    this.contactNormal = new CANNON.Vec3()

    this.jumpVelocity = 10
    this.velocityFactor = 150
    this.upAxis = new CANNON.Vec3(0, 1, 0)

    this.rotateAngle = new THREE.Vector3(0, 1, 0)
    this.rotateQuarternion = new THREE.Quaternion()
    this.directionOffset = 0
  }

  calculateIdealOffset() {
    const idealOffset = new THREE.Vector3(0, 3, 2)
    idealOffset.applyQuaternion(this.cannonBody.quaternion)
    idealOffset.add(this.cannonBody.position)
    return idealOffset
  }

  setGamepadControl() {
    this.gamepadControls = new GamepadControls()
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

          if (this.animationsBody.actualState != this.animationsBody.mixer.clipAction(this.animationsBody.object.animations[3])) {
            this.animationsBody.prevState = this.animationsBody.actualState
            this.animationsBody.actualState = this.animationsBody.mixer.clipAction(this.animationsBody.object.animations[3])

            this.animationsBody.setState(this.animationsBody.prevState, this.animationsBody.actualState)
          }

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
          }
          this.moveJump = false
          break
        case this.keysBind.moveShift:
          this.toggleRun = true

          if (this.animationsBody.actualState != this.animationsBody.mixer.clipAction(this.animationsBody.object.animations[1])) {
            this.animationsBody.prevState = this.animationsBody.actualState
            this.animationsBody.actualState = this.animationsBody.mixer.clipAction(this.animationsBody.object.animations[1])

            this.animationsBody.setState(this.animationsBody.prevState, this.animationsBody.actualState)
          }

          break
      }

      // if (this.animationsBody.actualState != '') {
      //   if (this.animationsBody.actualState._clip.name == 'Walk' || this.animationsBody.actualState._clip.name == 'Run') {
      var angleYCameraDirection = Math.atan2(
        (this.camera.position.x - this.cannonBody.position.x),
        (this.camera.position.z - this.cannonBody.position.z))

      if (this.moveFoward) {
        if (this.moveLeft) {
          this.directionOffset = Math.PI / 4
        } else if (this.moveRight) {
          this.directionOffset = - Math.PI / 4
        }
      } else if (this.moveBackward) {
        if (this.moveLeft) {
          this.directionOffset = Math.PI / 4 + Math.PI / 2
        } else if (this.moveRight) {
          this.directionOffset = -Math.PI / 4 - Math.PI / 2
        } else {
          this.directionOffset = Math.PI
        }
      } else if (this.moveLeft) {
        this.directionOffset = Math.PI / 2
      } else if (this.moveRight) {
        this.directionOffset = - Math.PI / 2
      }

      this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + this.directionOffset)

      var quatToRotate = new THREE.Quaternion
      quatToRotate.copy(this.cannonBody.quaternion)
      quatToRotate.rotateTowards(this.rotateQuarternion, 0.01)

      this.cannonBody.quaternion.copy(quatToRotate)
      // this.quaternion.copy(quatToRotate)
      //   }
      // }

    })

    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case this.keysBind.moveFoward[0]:
        case this.keysBind.moveFoward[1]:
          this.moveFoward = false

          if (this.animationsBody.actualState != this.animationsBody.mixer.clipAction(this.animationsBody.object.animations[0])) {
            this.animationsBody.prevState = this.animationsBody.actualState
            this.animationsBody.actualState = this.animationsBody.mixer.clipAction(this.animationsBody.object.animations[0])

            this.animationsBody.setState(this.animationsBody.prevState, this.animationsBody.actualState)
          }

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

          if (this.animationsBody.actualState = this.animationsBody.mixer.clipAction(this.animationsBody.object.animations[1])) {
            this.animationsBody.prevState = this.animationsBody.actualState
            this.animationsBody.actualState = this.animationsBody.mixer.clipAction(this.animationsBody.object.animations[3])

            this.animationsBody.setState(this.animationsBody.prevState, this.animationsBody.actualState)
          }

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

    ////// VELOCIDADE COM SHIFT ///
    if (this.toggleRun == true) {
      this.velocityFactor = 450
    } else {
      this.velocityFactor = 150
    }
    ///////////////////////////////

    /** Convert velocity to world coordinates */
    this.quaternion.setFromEuler(this.mouseMove.euler)
    this.inputVelocity.applyQuaternion(this.quaternion)

    this.velocity.x = this.inputVelocity.x
    this.velocity.z = this.inputVelocity.z

    if (this.cannonBody.position.y < 0.1) {
      this.moveJump = true
    }

    if (this.mouseMove) {
      this.mouseMove.update(this.time.elapsed)
    }

    if (this.gamepadControls) {
      this.gamepadControls.update()
    }
  }
}
