import * as CANNON from 'cannon-es'

import { threeToCannon, ShapeType } from 'three-to-cannon'

export default class MainPhyCharacter {
  constructor(_obj3D){
    const {shape, offset} = threeToCannon(_obj3D, { type: ShapeType.BOX})
    
    this.characterBody = new CANNON.Body({
      mass: 10,
      shape: shape
    })

    this.characterBody.id = 'BoxPhy'
    this.characterBody.stats = { hp: 100 }
    this.characterBody.position.y = 15
    this.characterBody.shapeOffsets[0].copy(offset)

    this.setControls()
  }

  setControls() {
    this.controls = {}

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case ' ':
          this.characterBody.velocity.y = 10
          break
      }
    })
  }
}
