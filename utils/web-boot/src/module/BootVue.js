import { isArray, isFunction } from '../utils/lang'

export default {
  async load (ctx) {
    await import('vue')
  }
}
