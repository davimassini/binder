import EventEmitter from './eventEmitter.js'

export default class Time extends EventEmitter {
  constructor() {
    super()

    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16
    this.playing = true

    this.tick = this.tick.bind(this)
    this.tick()
  }

  play() {
    this.playing = true
  }

  pause() {
    this.playing = false
  }

  tick() {
    this.ticker = window.requestAnimationFrame(this.tick)

    const current = Date.now()

    this.delta = (current - this.current) / 1000
    this.elapsed += this.playing ? this.delta : 0
    this.current = current

    // console.log(this.delta);

    if (this.delta > 60) {
      this.delta = 60
    }

    if (this.playing) {
      this.trigger('tick')
    }
  }

  stop() {
    window.cancelAnimationFrame(this.ticker)
  }
}
