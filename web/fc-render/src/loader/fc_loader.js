import ReactPelFactory from '../factory/ReactPelFactory'
import VuePelFactory from '../factory/VuePelFactory'
import webpackExternals from 'display-pack-externals'
import debug from 'debug'

import loadjs from 'loadjs'
// 组态化组件资源服务地址
const log = debug('editor:fc-loader')
const important = debug('important')

/**
 * 图元动态加载器
 */
export default class FCLoader {
  /**
   * 构造器
   * @param unpkgUrl 图元文件的unpkg服务地址
   */
  constructor (baseUrl) {
    this.unpkgUrl = baseUrl || ''
    // 前端组件加载缓存
    this.componentCache = {}
    // 加载的前端npm包描述缓存
    this.packageJSONCache = {}
    // 未安装的组件包列表
    this.packageNotInstalled = []
    // 加载的字体列表
    this.loadedFonts = []
    // 支持打包形式为amd的组件包的加载
    window.define = this.define
    // 已经加载的前端组件的第三方依赖库
    window.externalLoaded = []
    important('组件加载器地址配置为： ' + this.unpkgUrl)

    this.packageLoadingPromises = {}
    this.scriptLoadingPromises = {}
  }

  setAppName (appName) {
    if (appName) {
      this.appName = appName
    }
  }

  getServePath () {
    if (this.appName) {
      return this.baseUrl + '/' + this.appName
    } else {
      return this.baseUrl
    }
  }

  getLoadPath (path) {
    if (this.appName) {
      return `${this.unpkgUrl}/${this.appName}/npm_packages/${path}`
    } else {
      return `${this.unpkgUrl}/default/npm_packages/${path}`
    }
  }

  /**
   * 获取图元的url地址， 图元url将作为图元的唯一标识，此方法根据图元定义->图元url进行统一转换
   * @param pel 图元定义  {
   *   packageName: '@gw/wind-pels-standard',
   *   version: '1.0.1',
   *   path: './build/container1.pel.js'
   * }
   * @returns {string}
   */
  getPelUrl (pel) {
    return `${pel.packageName}/${pel.path}`
  }

  /**
   * 获取图元的服务对象的名称
   * @param pel 图元定义
   * @returns {string}
   */
  getComponentLibName (pel) {
    return new URL(pel.path, `http://any.com/${pel.packageName}/`).pathname.substr(1)
    // return path.resolve(`${pel.packageName}`, pel.path).substr(1);
  }

  /**
     * 获取组件
     * 优先从fcCache 中获取（依赖版本）；再从window下获取（不依赖版本）
     * @param {*} pel
     */
  getComponent (componentUri) {
    if (this.componentCache[componentUri]) {
      return this.componentCache[componentUri]
    } else {
      return null
    }
  }

  /**
     * 加载指定的字体（按名称）
     * @param name 字体名称
     * @param pkg 字体所在的图元包,包括名称和版本默认为@gw/web-font-assets@latest
     */
  async loadFont (pkg, name, url) {
    if (!name || this.loadedFonts.indexOf(name) > -1) {
      return
    }
    try {
      const fontFaceName = pkg ? (pkg + '/' + url) : name
      let fontUrl = this.getServePath() + '/npm_packages/' + (pkg ? (pkg + '/' + url) : name)

      // 这是对110的字体加载的兼容， 110图纸中，字体是直接按名称保存到图元中的 例如 groteskia，没有直接提供字体地址的url。 所以需要根据字体包中JSON的定义获取具体的字体url
      // 进行进一步的加载
      if (!pkg && !url && name.indexOf('.woff') === -1) {
        await this.confirmPackageDependencies('@gw/web-font-assets')
        if (this.packageJSONCache['@gw/web-font-assets']) {
          fontUrl = this.getServePath() + '/npm_packages/@gw/web-font-assets/' + this.packageJSONCache['@gw/web-font-assets'].fonts[name].url
        } else {
          console.error('加载字体地址未找到', name)
        }

        // https://localhost:3001/scada/npm_packages/@gw/web-font-assets/package.json
      }

      // name 直接提供完整地址的情况
      const ff = new FontFace(fontFaceName, `url(${fontUrl})`)

      await ff.load()
      document.fonts.add(ff)

      this.loadedFonts.push(name)
    } catch (e) {
      console.error('加载字体异常', name, pkg, e)
    }
  }

  async loadScript (url) {
    if (!this.scriptLoadingPromises[url]) {
      this.scriptLoadingPromises[url] = (async () => {
        try {
          log('加载库:' + url)
          await loadjs(url, {
            returnPromise: true,
            before: function (scriptPath, scriptEl) {
              scriptEl.crossOrigin = true
            }
          })
        } catch (e) {
          console.error('第三方库加载异常 ', `${url}`)
        }
      })()
    }
    await this.scriptLoadingPromises[url]
  }

  /**
     * 加载前端组件的代码，支持2种方式 globalThis 及 amd
     */
  async loadFCScript (url, pelLibName) {
    const scriptUrl = this.getLoadPath(url)

    // 加载图元脚本，其中每个图元在编译时都已经设置到了window根上，以图元url为可以key
    await this.loadScript(scriptUrl)
  }

  /**
   * 按照图元定义加载图元
   * 图元定义基本如下：
   * {
   *   packageName: '@gw/wind-pels-standard',
   *   path: './build/container1.pel.js',
   *   dependencies: ['react', 'antd']
   * }
   */
  async loadComponent (packageName, path, dependencies) {
    const componentUri = `${packageName}/${path}`
    const cache = this.getComponent(componentUri)

    if (cache) {
      return cache
    }

    try {
      // 加载组件的依赖包
      await this.confirmDependencies(dependencies)
      await this.loadScript(this.getLoadPath(componentUri))

      // 打包过程中要求将图元包以  `${pel.packageName}/${pel.version}/${pel.path}`方式统一命名图元的名称， 并作为window对象的属性进行挂载，这里就按照这个path来获取
      // path的规则是 包名/版本名/图元名 或者 包名/图元名 版本名同一图元2个版本在一个页面情况下才会用到
      const esModule = window[componentUri]

      if (!esModule) {
        log('前端组件无法加载' + componentUri)
        return null
      }
      const fcp = esModule.default

      if (fcp.externals && fcp.externals.length) {
        await this.confirmDependencies(fcp.externals)
      }
      // 处理渲染器，加载渲染器依赖
      if (fcp.component) {
        let fc = fcp.component

        // 支持异步的加载情况
        if (typeof fc === 'function' && fc.constructor.name === 'AsyncFunction') {
          fc = (await fc()).default
        }
        if (fc.props) {
          // vue 图元
          this.loadPelExternals(['vue'])
          fcp.factory = new VuePelFactory(fc)
        } else {
          fcp.factory = new ReactPelFactory(fc)
        }
      }
      if (fcp.factory) {
        // 加载渲染器依赖
        await fcp.factory.loadDependencies()
      } else {
        log('组件 Component定义未加载到', fcp)
      }

      this.componentCache[componentUri] = fcp
      return fcp
    } catch (e) {
      log('组件加载异常', e)
      return null
    }
  }

  async loadDependency (name) {
    if (window.externalLoaded.indexOf(name) > -1) {
      return true
    }

    // 获取外部依赖库的下载地址 external为图元中声明的依赖库名称 例如 'echarts'
    const externalModule = webpackExternals.externals.filter(ex => name === ex.module)[0]

    if (externalModule) {
      // 判断第三方库如果已经在全局加载，则直接使用全局的库
      if (externalModule.root && window[externalModule.root]) {
        return window[externalModule.root]
      }

      if (externalModule.dependencies) {
        await this.confirmDependencies(externalModule.dependencies)
      }

      if (externalModule.style) {
        if (typeof externalModule.style === 'string') {
          // css加载不需要异步处理
          this.loadScript(this.getLoadPath(externalModule.style))
        }
      }
      await this.loadScript(this.getLoadPath(externalModule.dist))

      // 这里必须加载完成才标志为loaded。否则外部可能请求并发下载，那么后面的并发判断成功但加载未完成
      window.externalLoaded.push(externalModule.module)
    } else if (/(http|https):\/\/([\w.]+\/?)\S*/.test(name)) {
      await this.loadScript(name)
      window.externalLoaded.push(name)
    } else {
      log('忽略库:' + name)
    }
  }

  /**
     * 加载多个dependencies（并行）
     * @param pel
     * @returns {Promise<void>}
     */
  async confirmDependencies (dependencies) {
    const promises = []

    for (const d of dependencies) {
      promises.push(this.loadDependency(d))
    }
    await Promise.all(promises)
  }
}
