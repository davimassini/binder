import * as THREE from 'three'

import Chapter from '../chapter.js'

export default class Animations {
  constructor(_options) {
    this.chapter = new Chapter()
    this.object = _options

    this.setAnimations()

    this.update()
  }

  setAnimations() {
    this.actualState = ''
    this.prevState = ''

    this.mixer = new THREE.AnimationMixer(this.object.scene)

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'g':
          this.prevState = this.actualState
          this.actualState = this.mixer.clipAction(this.object.animations[0])

          this.setState(this.prevState, this.actualState)
          break
        case 'h':
          this.prevState = this.actualState
          this.actualState = this.mixer.clipAction(this.object.animations[1])

          this.setState(this.prevState, this.actualState)
          break
        case 'j':
          this.prevState = this.actualState
          this.actualState = this.mixer.clipAction(this.object.animations[3])

          this.setState(this.prevState, this.actualState)
          break
      }
    })
  }

  setState(prevState, actualState) {
    if (prevState != '') {
      switch (actualState.getClip().name) {
        case 'Idle':
          actualState.time = 0.0
          actualState.enabled = true
          actualState.setEffectiveTimeScale(1.0)
          actualState.setEffectiveWeight(1.0)
          break
        case 'Run':
          actualState.enabled = true
          if (prevState.getClip().name === 'Walk') {
            actualState.time = prevState.time * (actualState.getClip().duration / prevState.getClip().duration)
          } else {
            actualState.time = 0.0
            actualState.setEffectiveTimeScale(1.0)
            actualState.setEffectiveWeight(1.0)
          }
          break
        case 'Walk':
          actualState.enabled = true
          if (prevState.getClip().name === 'Run') {
            actualState.time = prevState.time * (actualState.getClip().duration / prevState.getClip().duration)
          } else {
            actualState.time = 0.0
            actualState.setEffectiveTimeScale(1.0)
            actualState.setEffectiveWeight(1.0)
          }
          break
      }
      actualState.crossFadeFrom(prevState, 0.5, true)
      actualState.play()
    } else {
      actualState.play()
    }
  }

  update() {
    if (this.mixer != null) {
      this.mixer.update(this.chapter.time.delta)
    }
  }
}
