import Renderer from './Renderer'
export default class VannilaRenderer extends Renderer {
  constructor (Component, el, initOption = {}) {
    super()
    this.renderer = new Component(el, initOption)
  }
}
