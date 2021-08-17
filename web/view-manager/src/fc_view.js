import debug from 'debug'
import './style.css'
import template from './template.js'
import _ from 'lodash'

const log = debug('runtime:fc-view')
const captureEvents = ['onclick', 'ondblclick', 'onmouseup', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseenter', 'onmouseover', 'oncontextmenu']

/**
 * 组件加载、渲染管理类。在loadAndRender过程进行组件加载等待，但在初始化之后就可以调用更新属性方法，属性会在加载完成后更新到组件显示。
 */
export default class FrontComponentView {
  /**
     * @param {Object} fcInstanceConfig 组件配置实例
     * @param {Loader} loader 加载器
     */
  constructor ({
    el,
    component,
    fcInstanceConfig,
    loader,
    context,
    preloadChild
  }) {
    this.el = el
    this.uuid = _.uniqueId('fc_')
    this.component = component
    this.fcInstanceConfig = fcInstanceConfig
    this.loader = loader
    this.context = context

    // 回调列表
    this.eventCallbacks = {}
    // 定义在元素上的原始事件
    this.domEvents = []
    // 回调最近一次传出的数据信息
    this.eventPayloadStack = {}
    // 加载标志
    this.loaded = false
    // 加载的子组件
    this.childrenFcViews = []
    // 模板元素的节点
    this.slotFcViews = {}
    // 设置加载时是否同时加载子节点
    this.preloadChild = preloadChild

    // 显隐情况
    if (fcInstanceConfig.visible === false) {
      this.visible = false
    } else {
      this.visible = true
    }

    if (!this.loaded) {
      this.setLoading(true)
    }
  }

  /**
     * 加载组件定义信息（fcp），包括组件的渲染引擎（执行代码）
     */
  async loadComponentDefinition () {
    if (this.loaded) {
      return
    }
    log('loadComponentDefinition', this.component)

    // 加载组件定义信息
    if (this.component.packageName != null || this.component.path != null) {
      const componentDefinition = await this.loader.loadComponent(this.component.packageName, this.component.path, this.component.dependencies)

      if (!componentDefinition || !componentDefinition.factory) {
        log('加载图元失败: 未获取组件', this.fcInstanceConfig)
        return
      }
      this.componentDefinition = componentDefinition

      // 枚举组件定义属性，加载相关的字体资源
      for (const prop of this.componentDefinition.props || []) {
        // 字体类型属性，并且指定了值
        if (prop.type === 'font' && this.instancePropConfig[prop.name]) {
          log('加载字体', this.instancePropConfig[prop.name])
          await this.loader.loadFont(null, this.instancePropConfig[prop.name])
        }
      }
    }

    if (this.fcInstanceConfig.slotElements) {
      for (const prop in this.fcInstanceConfig.slotElements) {
        const fcInstanceConfig = this.fcInstanceConfig.slotElements[prop]
        const slotFcView = new FrontComponentView({
          fcInstanceConfig,
          loader: this.loader,
          apolloApp: this.apolloApp,
          contextVariables: this.contextVariables,
          preloadChild: this.preloadChild,
          scopeVariables: this.scopeVariables,
          pageId: this.pageId
        })

        // 插槽及以下组件必须提前加载，因为很多弹层、下拉的场合如果展示了才加载会造成页面中断
        slotFcView.isSlot = true
        await slotFcView.loadComponentDefinition()
        await slotFcView.initChildViews()

        this.slotFcViews[prop] = slotFcView
      }
    }

    this.loaded = true
  }

  /**
     * 加载组件代码、并更新为组件初始化数据
     * @param initProps 初始化数据，如果希望一开始渲染就能加载运行数据，可以指定此字段
     * @returns {Promise<void>}
     */
  async loadAndRender () {
    await this.loadComponentDefinition()
    await this.initChildViews()
    if (this.fcInstanceConfig.isRelativeBlockContainer) {
      // ht 的相对布局容器
      this.relativeContainerMount(this.el)
    } else {
      if (!this.componentDefinition) {
        return
      }
      this.initPropsAndEvents()
      this.mount(this.el)
    }
  }

  async initChildViews () {
    // 直接从布局设置了若干子节点
    for (const children of this.fcInstanceConfig.children || []) {
      const childView = new FrontComponentView({
        fcInstanceConfig: children,
        loader: this.loader,
        apolloApp: this.apolloApp,
        contextVariables: this.contextVariables,
        scopeVariables: this.scopeVariables,
        preloadChild: this.preloadChild,
        pageId: this.pageId
      })

      childView.pageId = this.pageId

      if (this.isSlot) {
        await childView.loadComponentDefinition()
      }

      if (this.preloadChild) {
        await childView.loadComponentDefinition()
      }

      await childView.initChildViews()

      this.childrenFcViews.push(childView)
    }
  }

  cloneView () {
    const fcv = new FrontComponentView({
      fcInstanceConfig: this.fcInstanceConfig,
      loader: this.loader,
      apolloApp: this.apolloApp,
      preloadChild: this.preloadChild,
      contextVariables: this.contextVariables,
      pageId: this.pageId
    })

    fcv.componentDefinition = this.componentDefinition

    // 克隆子节点信息
    if (this.childrenFcViews) {
      fcv.childrenFcViews = this.childrenFcViews.map(v => v.cloneView())
    }

    // 克隆slot节点信息
    for (const slotKey in this.slotFcViews) {
      fcv.slotFcViews[slotKey] = this.slotFcViews[slotKey].cloneView()
    }
    return fcv
  }

  // 递归 设置、更新子节点数据信息
  setScopeVariables (scopeVariables) {
    this.scopeVariables = scopeVariables

    for (const childFcView of this.childrenFcViews) {
      childFcView.setScopeVariables(scopeVariables)
    }
  }

  setScopeVariable (key, value) {
    this.scopeVariables[key] = value

    for (const childFcView of this.childrenFcViews) {
      childFcView.setScopeVariable(key, value)
    }
  }

  isBlockFcView () {
    return this.fcInstanceConfig.packageName == null && this.fcInstanceConfig.path == null
  }

  /**
     * 初始化图元的属性和事件
     * @param {Object} variables 页面变量信息
     */
  initPropsAndEvents (variables) {
    if (variables) {
      this.contextVariables = variables
    }
    // 设置回写属性值的事件
    this.propertyWriteBackEvents = {}
    this.instancePropConfig = this.fcInstanceConfig.staticProps || {}
    // 枚举、处理所有属性定义
    for (const prop of this.componentDefinition.props || []) {
      // 默认值次序： 控件实例化给的默认值 -> 组态化定义的默认值 -> 前端组件的默认值 (这个不给就用默认值了)
      if (this.instancePropConfig[prop.name] == null && prop.value != null) {
        this.instancePropConfig[prop.name] = prop.value
      }

      // 处理属性的input情况 类似 vue的 v-model
      if (prop.name === 'value') {
        this.instancePropConfig.input = val => {
          this.emit('input', val)
        }
        this.propertyWriteBackEvents.input = 'value'
      }

      if (prop.input === true) {
        // input相当于v-model，只能设置到一个属性上面
        const eventName = 'set' + prop.name.substr(0, 1).toUpperCase() + prop.name.substr(1)

        // 当双向绑定时， 获取动态绑定部分配置的属性值
        this.instancePropConfig[eventName] = val => {
          this.emit(eventName, val)
        }
        this.propertyWriteBackEvents[eventName] = prop.name
      }
      // 属性进行动态绑定的情况 （动态属性） 这里只进行一次计算， 动态属性更新时会调用update进行更新
      // eslint-disable-next-line max-len
      if (this.fcInstanceConfig.reactiveProps && this.fcInstanceConfig.reactiveProps[prop.name]) {
        const context = Object.assign({}, this.contextVariables, {
          $scope: this.scopeVariables
        })
        this.instancePropConfig[prop.name] = template(this.fcInstanceConfig.reactiveProps[prop.name], context)
      }
    }

    // 处理组件双向绑定
    if (this.interactHandler) {
      this.interactHandler.attachInteractTo(this)
    }

    // 子节点的fcView也同时放入
    if (this.childrenFcViews && this.childrenFcViews.length) {
      this.instancePropConfig.childrenViews = this.childrenFcViews
      this.childrenFcViews.forEach(fcView => {
        fcView.setScopeVariables(this.scopeVariables)
      })
    }

    // 按照图纸给出宽度和高度到属性设置 后面moute时可能还要调整
    this.instancePropConfig.width = this.fcInstanceConfig.width
    this.instancePropConfig.height = this.fcInstanceConfig.height

    // 事件类属性写入，DOM初始化后事件才能挂到源头
    for (const event of this.componentDefinition.events || []) {
      this.instancePropConfig[event.name] = (...args) => {
        this.emit(event.name, ...args)
      }
    }

    // 写入插槽信息
    for (const slotProp in this.slotFcViews) {
      this.instancePropConfig[slotProp] = this.slotFcViews[slotProp]
    }

    this.convertPropTypes(this.instancePropConfig, this.componentDefinition.props)

    // 设置默认的系统级别字段
    // TODO 这些字段未来声明了才注入
    this.instancePropConfig.currentFcView = this
    this.instancePropConfig.isRuntime = true
    this.instancePropConfig.contextVariables = this.contextVariables
    this.instancePropConfig.apolloApp = this.apolloApp
  }

  /**
     * 检查并设置数据绑定的加载：
     * 如果绑定的数据未获取到，则加载Loading层
     * 否则取消loading层
     */
  checkDBLoaded () {
    if (window.fdreConfig && window.fdreConfig.dbLoadingMask) {
      if (this.isDbFetched() === false) {
        this.setLoading(true)
      } else {
        this.setLoading(false)
      }
    }
  }

  // 根据数据绑定配置的内容获取 是否属性已经得到了数据绑定的信息
  isDbFetched () {
    let fetched = true

    if (this.fcInstanceConfig && this.fcInstanceConfig.db) {
      const dbKeys = Object.keys(this.fcInstanceConfig.db)

      for (const propName of dbKeys) {
        if (this.instancePropConfig[propName] == null) {
          fetched = false
        }
      }
    }
    return fetched
  }

  /**
     * 处理组件引用了其他组件的情况
     * @param {*} fcViewsMap
     */
  initLink (fcViewsMap) {
    if (this.componentDefinition) {
      let linkUpdated = false

      for (const prop of this.componentDefinition.props || []) {
        // 属性定义为多个图元的引用
        if (prop.isRef === true) {
          const fcIds = this.instancePropConfig[prop.name]

          this.instancePropConfig[prop.name] = []

          for (const id of fcIds) {
            linkUpdated = true
            this.instancePropConfig[prop.name].push(fcViewsMap[id])
          }
        }
      }
      if (linkUpdated) {
        this.updateProps()
      }
    }
  }

  /**
     * 获取节点下所有的子布局节点
     * @returns
     */
  getLayoutChildrenViews () {
    let result = []

    if (this.childrenFcViews) {
      result = result.concat(this.childrenFcViews)

      for (const fcView of this.childrenFcViews) {
        result = result.concat(fcView.getLayoutChildrenViews())
      }
    }

    // slot同时也作为子节点
    // TODO 这个未来还是要区分 slot内容是否是模板
    if (this.slotFcViews && Object.values(this.slotFcViews).length) {
      for (const slotFcView of Object.values(this.slotFcViews)) {
        result.push(slotFcView)
        result = result.concat(slotFcView.getLayoutChildrenViews())
      }
    }
    return result
  }

  /**
     * 执行组件初次加载 mount到具体DOM元素
     */
  mount (el) {
    if (el) {
      this.el = el
      // 检测到需要为DOM绑定事件，则在此处绑定
      // !!!! 事件的回调已经统一注册到 this.eventCallbacks 之中了， 当emit时按名称会调用事件
      if (this.domEvents.length) {
        for (const eventName of this.domEvents) {
          this.attachElEvent(el, eventName)
        }
      }
    }
    try {
      if (this.el.style.position === 'absolute') {
        // 对于绝对定位的元素，直接给定绝对定位的宽高信息
        if (this.el.style.width && this.el.style.height) {
          this.instancePropConfig.width = parseInt(this.el.style.width)
          this.instancePropConfig.height = parseInt(this.el.style.height)
        }
      } else {
        let rect = this.el.getBoundingClientRect()

        if (this.el.style.display === 'none') {
          this.el.style.display = ''
          rect = this.el.getBoundingClientRect()
          this.el.style.display = 'none'
        }

        if (rect.width > 0 && rect.height > 0) {
          this.instancePropConfig.width = rect.width
          this.instancePropConfig.height = rect.height
        }
      }
      this.el.style.background = ''

      log('mount with', this.fcInstanceConfig.guid, this.instancePropConfig)

      this.renderer = this.componentDefinition.factory.mount(this.el, this.instancePropConfig)
      // 检查数据获取是否满足， 如果未获取 显示一个加载中的遮罩层
      this.checkDBLoaded()
    } catch (e) {
      if (window.localStorage.fcview === 'debug') {
        this.el.innerHTML = this.fcInstanceConfig.packageName + '@' + this.fcInstanceConfig.version + '/' + this.fcInstanceConfig.path + '<br>' + e
      }
      log(e)
    }
    this.setVisible(this.visible)
  }

  async relativeContainerMount (el) {
    if (el) {
      this.el = el
    }
    if (this.el.style.position !== 'absolute') {
      this.el.style.position = 'relative'
    }
    this.el.style.background = ''

    for (const childView of this.childrenFcViews) {
      const div = document.createElement('div')

      div.style.position = 'absolute'
      div.style.background = 'rgba(255, 255, 255, .2)'

      div.style.left = (childView.fcInstanceConfig.x - this.fcInstanceConfig.x) + 'px'
      div.style.top = (childView.fcInstanceConfig.y - this.fcInstanceConfig.y) + 'px'

      div.style.width = (100 * childView.fcInstanceConfig.width / this.fcInstanceConfig.width) + '%'
      div.style.height = (100 * childView.fcInstanceConfig.height / this.fcInstanceConfig.height) + '%'

      this.el.appendChild(div)

      childView.el = div
      await childView.loadAndRender()
    }
    this.setVisible(this.visible)
  }

  /**
     * 更新组件属性信息
     * @param {Object} props 要更新的属性
     * @param {Object} variables 新的页面变量信息
     */
  updateProps (props) {
    this.instancePropConfig.contextVariables = this.contextVariables

    if (!props) {
      // 如果未传入属性，则更新所有动态属性
      for (const reactiveProp in this.fcInstanceConfig.reactiveProps) {
        this.instancePropConfig[reactiveProp] = template(this.fcInstanceConfig.reactiveProps[reactiveProp], Object.assign({}, this.contextVariables, {
          $scope: this.scopeVariables
        }))
      }
    } else {
      // 只更新特定的值
      Object.assign(this.instancePropConfig, props)
    }

    if (this.renderer) {
      try {
        log('updateProps', this.fcId, this.instancePropConfig)
        this.convertPropTypes(this.instancePropConfig, this.componentDefinition.props)
        this.renderer.updateProps(this.instancePropConfig)

        // 检查数据获取是否满足， 如果未获取 显示一个加载中的遮罩层
        this.checkDBLoaded()
      } catch (e) {
        log('用属性渲染组件出错', this.fcInstanceConfig.guid, this.instancePropConfig, this)
      }
    } else {
      log('updateProps umounted', this.fcId, this.instancePropConfig)
    }
  }

  /**
     * 属性按照类型定义进行转换处理
     * @param {*} props 属性对象值
     * @param {*} definition 属性定义
     * @returns
     */
  convertPropTypes (props, definition) {
    if (definition) {
      for (const propDefinition of definition) {
        // 对于定义的属性有值，进行按类型的自字符串的转换处理
        if (typeof props[propDefinition.name] === 'string' && propDefinition.type !== 'string') {
          switch (propDefinition.type) {
            case 'boolean':
              if (props[propDefinition.name] === 'false' || props[propDefinition.name] === '0' || props[propDefinition.name] === '') {
                props[propDefinition.name] = false
              } else {
                props[propDefinition.name] = Boolean(props[propDefinition.name])
              }
              break
            case 'object':
            case 'array':
              try {
                props[propDefinition.name] = JSON.parse(props[propDefinition.name])
              } catch (e) {
                // 只是尝试转换 失败了保持旧值
              }
              break
            case 'number':
              props[propDefinition.name] = Number(props[propDefinition.name])
              break
            default:
              break
          }
        }
      }
    }
    return props
  }

  /**
     *
     * @param {*} method
     * @param {*} args
     */
  invoke (method, args) {
    log('invoke', this.fcId, method)
    return this.renderer.invoke(method, args)
  }

  /**
     * 设置切换组件是否可见
     * @param visible
     */
  setVisible (visible) {
    this.visible = visible
    if (this.el) {
      if (visible) {
        this.el.style.display = 'inherit'
      } else {
        this.el.style.display = 'none'
      }
    }
  }

  getVisible () {
    if (this.el.style.display === 'none') {
      return false
    } else {
      return true
    }
  }

  /**
     * 设置加载状态
     * @param {*} isLoading
     */
  setLoading (isLoading) {
    if (this.el) {
      if (isLoading) {
        let loadingEl = document.querySelector('#loading-' + this.uuid)

        if (!loadingEl) {
          loadingEl = document.createElement('div')
          loadingEl.id = 'loading-' + this.uuid
        }

        loadingEl.className = 'cover-spin'

        if (this.el.style.position !== 'absolute') {
          this.el.style.position = 'relative'
        }
        this.el.appendChild(loadingEl)
      } else {
        const loadingEl = document.querySelector('#loading-' + this.uuid)

        if (loadingEl) {
          this.el.removeChild(loadingEl)
        }
      }
    }
  }

  /**
     * 设置更改节点位置
     * @param x
     * @param y
     */
  setPosition ({ x, y }) {
    if (x) {
      this.el.style.left = x + 'px'
    }
    if (y) {
      this.el.style.top = y + 'px'
    }
  }

  /**
     * 快捷设置组件的值
     * @param {Object} value 设置的值
     */
  val (value) {
    this.updateProps({
      [this.inputPropKey]: value
    })
  }

  /**
     * 获取所有的组件绑定信息
     * @todo
     */
  getEventBindings () {
    return {}
  }

  /**
     * 发出、并调用callbak相关回调
     * @param {String} event 事件名称
     * @param {Object} payload 事件参数
     */
  emit (event, payload) {
    if (this.eventCallbacks[event]) {
      try {
        this.eventCallbacks[event](payload)
      } catch (e) {
        log('事件回调处理异常', event, payload, e)
      }
    } else {
      // 缓存最近一次参数，当 on 注册时可以直接调用
      this.eventPayloadStack[event] = payload
    }
  }

  /**
     * 直接绑定inpu事件的回调
     * @param {Function} callback
     */
  input (callback) {
    this.eventCallbacks.input = callback
  }

  /**
     * 设置事件回调
     * @param {String} event 事件名称
     * @param {Function} callback 回调方法
     */
  on (event, callback) {
    // 设置系统事件的回调
    if (captureEvents.indexOf(event.toLocaleLowerCase()) > -1) {
      if (this.el) {
        this.attachElEvent(this.el, event.toLocaleLowerCase(), callback)
      } else {
        this.domEvents.push(event.toLocaleLowerCase())
      }
    }
    this.eventCallbacks[event] = callback
    if (this.eventPayloadStack[event] !== undefined) {
      try {
        callback(this.eventPayloadStack[event])
      } catch (e) {
        log('回调处理异常', event, this.eventPayloadStack[event], e)
      } finally {
        delete this.eventPayloadStack[event]
      }
    }
  }

  /**
     * 为DOM元素绑定基础的交互事件
     * @param {*} el
     * @param {*} eventName
     */
  attachElEvent (el, eventName) {
    el[eventName] = () => {
      try {
        this.emit(eventName, this.instancePropConfig)
      } catch (e) {
        console.error('事件处理异常', e)
      }
      return false
    }
  }

  layout () {
    if (this.el) {
      let rect = this.el.getBoundingClientRect()

      if (this.el.style.display === 'none') {
        this.el.style.display = ''
        rect = this.el.getBoundingClientRect()
        this.el.style.display = 'none'
      }

      if (rect.width > 0 && rect.height > 0) {
        this.instancePropConfig.width = rect.width
        this.instancePropConfig.height = rect.height
      }

      this.updateProps({
        width: rect.width,
        height: rect.height
      })

      for (const childFcView of this.childrenFcViews) {
        childFcView.layout()
      }
    }
  }

  unmount () {
    if (this.childrenFcViews && this.childrenFcViews.length) {
      for (const childFcView of this.childrenFcViews) {
        childFcView.unmount()
      }
    }

    if (this.slotFcViews && this.slotFcViews.length) {
      for (const slotFcView of this.slotFcViews) {
        slotFcView.unmount()
      }
    }

    // 回调内容清空
    this.eventPayloadStack = {}

    if (this.el && this.renderer) {
      this.renderer.destroy()
      this.renderer = null
    }
  }

  /**
     * 删除DOM上所有事件并清除div
     */
  destory () {
    this.renderer.destroy()
    if (this.el && this.el.parentElement) {
      this.el.parentElement.removeChild(this.el)
    }
  }
}
