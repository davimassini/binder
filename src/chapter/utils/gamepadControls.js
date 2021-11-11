
export default class GamepadControls {
  constructor(_options) {
    this.startGamepad()
  }

  startGamepad() {
    this.firstVerify = true;
    window.addEventListener("gamepadconnected", (event) => {
      console.log('New Gamepad has been connected!');
      console.log(event.gamepad);

      this.gamepads = navigator.getGamepads()
    })
  }

  buttonPressed(pressedButtons) {
    for (const button of pressedButtons) {
      console.log(button);
      pressedButtons = null
    }
  }

  update() {
    if (this.gamepads) {
      const pressedButtons = this.gamepads[0].buttons.map((button, id) => ({id, button})).filter(({button: {pressed}}) => { return !!pressed })
      this.buttonPressed(pressedButtons)
    }
  }
}