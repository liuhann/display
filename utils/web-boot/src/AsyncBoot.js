import contextProto from './utils/context'
import { isArray, isFunction } from './utils/lang'
import compose from 'koa-compose'
import page from 'page'

import { ReactRenderer, VannilaRenderer } from 'fc-render'

import BootReact from './module/BootReact.js'
import BootVue from './module/BootVue.js'

/**
 * Boot class
 * Load modules, extract module routes and data services
 * @class AsyncBoot
 */
/**
 * @param {object} bootOpts boot options
 * @param {array} bootOpts.packages package list
 * @param {object|async function} [bootOpts.rootApp={}] root module
 * @param {string} [bootOpts.mount="app"] the html element to mount to
 * @param {object} [bootOpts.servers] http services locations
 * @param {function|array} [bootOpts.started] callback function or a list of middle-wares with koa-style which would be trigger like onions
 */
class AsyncBoot {
  constructor (bootOpts) {
    // page context
    this.ctx = Object.create(contextProto)
    Object.assign(this.ctx, bootOpts)
    this.ctx.page = page
    this.systemModules = {
      react: BootReact,
      vue: BootVue
    }

    // application modules  (load on startUp)
    this.modules = []
    this.moduleHanlders = []
    this.onStarted = isFunction(bootOpts.started) ? [bootOpts.started] : (bootOpts.started || [])
  }

  async startUp () {
    await this.loadSystemModules()
    await this.loadModules(this.ctx.packages)
    await this.started()
  }

  async loadSystemModules () {
    const awaits = []
    for (const key in this.systemModules) {
      awaits.push(this.use(this.systemModules[key]))
    }
    await Promise.all(awaits)
  }

  /**
   * Using system modules
   * @param system
   * @param options
   * @returns {Promise<[]>}
   */
  async use (system, options) {
    // onload\moduleLoaded\started callbacks
    if (isFunction(system.load)) {
      await system.load(this.ctx)
    }
    if (isFunction(system.onModuleLoad)) {
      this.moduleHanlders.push(system.onModuleLoad)
    }
    if (isFunction(system.started)) {
      this.onStarted.push(system.started)
    }
  }

  async loadModules (packages) {
    // 依次循环解析每个module
    for (const def of packages) {
      let module = def
      // 以import形式引入的module
      if (isFunction(def)) {
        module = await def(this)
      }
      for (const moduleHanlder of this.moduleHanlders) {
        moduleHanlder(module, this)
      }
      if (isFunction(module.onload)) {
        await module.onload(this.ctx, this.ctx.config || {})
      }
      if (isArray(module.routes)) {
        for (const route of module.routes) {
          page(route.path, async (ctx, next) => {
            if (route.Component) {
              let Component = route.Component

              if (Component.then) {
                Component = (await Component).default
              }

              Object.assign(this.ctx, ctx)
              if (route.el) {
                this.ctx.$el = document.querySelector(route.el)
              }
              if (route.type === 'react') {
                ctx.render = new ReactRenderer(Component, this.ctx.$el, {
                  ctx: this.ctx
                })
              } else {
                ctx.render = new VannilaRenderer(Component, this.ctx.$el, {
                  ctx: this.ctx
                })
              }
            }
            next()
          })
        }
      }
      this.modules.push(module)
    }
  }

  /**
   * 处理系统模块的 started 事件， 这个次序遵循koa洋葱圈模型
   */
  async started () {
    const composed = compose(this.onStarted)
    try {
      await composed(this.ctx)
    } catch (err) {
      console.error('boot err:', err)
    }
  }
}

export default AsyncBoot
