import * as CANNON from 'cannon-es'

import { threeToCannon, ShapeType } from 'three-to-cannon'
import Controls from '../../../utils/controls'

export default class PhyCharacter {
  constructor(_obj3D){
    const {shape, offset} = threeToCannon(_obj3D, { type: ShapeType.BOX})
    
    this.characterBody = new CANNON.Body({
      mass: 10,
      shape: shape
    })

    this.characterBody.id = 'FoxPhy'
    this.characterBody.stats = { hp: 100 }
    this.characterBody.position.x = -2
    this.characterBody.shapeOffsets[0].copy(offset)

    // this.setControls()
  }

  setControls() {
    setTimeout(() =>  {
      this.controls = new Controls(this.characterBody)
    }, 600)
  }

  update() {
    if (this.controls) { 
      this.controls.update()
    }
  }
}
