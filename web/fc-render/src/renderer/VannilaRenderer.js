import Renderer from './Renderer'
export default class VannilaRenderer extends Renderer {
  constructor (Component, el, initOption = {}) {
    super()
    if (typeof Component === 'function') {
      Component(el, initOption)
    }
  }
}
