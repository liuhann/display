import ReactPelFactory from '../factory/ReactPelFactory'
import VuePelFactory from '../factory/VuePelFactory'
import webpackExternals from 'display-pack-externals'
import ky from 'ky'
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
   * @param baseUrl 图元下载基础地址
   * @param unpkgUrl 图元文件的unpkg服务地址
   */
  constructor (baseUrl) {
    this.baseUrl = baseUrl || ''
    // 前端组件加载缓存
    this.fcCache = {}
    // 加载的前端npm包描述缓存
    this.packageJSONCache = {}
    // 未安装的组件包列表
    this.packageNotInstalled = []
    // 加载的字体列表
    this.loadedFonts = []
    // 支持打包形式为amd的组件包的加载
    window.define = this.define
    // 已经加载的前端组件的第三方依赖库
    window.fcExternalLoaded = []
    important('组件加载器地址配置为： ' + this.baseUrl)

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
  getComponent (pel) {
    try {
      // 拼接组件url（加版本号）
      const componentUrl = this.getPelUrl(pel)

      if (this.fcCache[componentUrl]) {
        return this.fcCache[componentUrl]
      } else {
        // 组件库更新了，保证之前绘制的组件版本仍然可用
        const pelLibName = this.getComponentLibName(pel)
        const esModule = window[pelLibName]

        return esModule && esModule.default
      }
    } catch (e) {
      console.log(`There is no ${pel} component`)
      return null
    }
  }

  /**
   * 加载图元对外部的代码依赖
   * @param {Array} externals 外部依赖库列表
   */
  async loadPelExternals (externals) {
    for (const external of externals) {
      // 获取外部依赖库的下载地址 external为图元中声明的依赖库名称 例如 'echarts'
      const externalModule = webpackExternals.externals.filter(ex => external === ex.module)[0]

      if (externalModule) {
        // 第三方包已经加载：继续处理
        // if (window.fcExternalLoaded.indexOf(externalModule.module) > -1) {
        //     continue;
        // }
        // 判断第三方库如果已经在全局加载，则直接使用全局的库
        if (externalModule.root && window[externalModule.root]) {
          continue
        }

        if (externalModule.dependencies) {
          await this.loadPelExternals(externalModule.dependencies)
        }

        const externalLibPath = externalModule.dist
          ? `${this.getServePath()}/npm_packages/${externalModule.dist}`
          : `${this.getServePath()}/npm_packages/${externalModule.prod}`

        if (externalModule.style) {
          if (typeof externalModule.style === 'string') {
            await this.loadScript(`${this.getServePath()}/npm_packages/${externalModule.style}`)
            // await this.loadCss(`${this.getServePath()}/npm_packages/${externalModule.style}`);
          }
        }

        if (!this.scriptLoadingPromises[externalLibPath]) {
          // loadjs会自动处理重复加载的问题，因此此处无需做额外处理
          this.scriptLoadingPromises[externalLibPath] = (async () => {
            try {
              log('加载第三方库:' + externalLibPath)

              await loadjs(externalLibPath, {
                returnPromise: true,
                before: function (scriptPath, scriptEl) {
                  scriptEl.crossOrigin = true
                }
              })
            } catch (e) {
              console.error('第三方库加载异常 ', `${this.baseUrl}/${externalModule.module}@latest/${externalModule.dist}`)
            }
          })()
        }

        await this.scriptLoadingPromises[externalLibPath]
        // 这里必须加载完成才标志为loaded。否则外部可能请求并发下载，那么后面的并发判断成功但加载未完成
        window.fcExternalLoaded.push(externalModule.module)
      } else {
        log('忽略库:' + external)
      }
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

  async loadCss (href) {
    // Create new link Element
    const link = document.createElement('link')

    // set the attributes for link element
    link.rel = 'stylesheet'

    link.type = 'text/css'

    link.href = href

    // Get HTML head element to append
    // link element to it
    document.getElementsByTagName('HEAD')[0].appendChild(link)
  }

  async loadScript (url) {
    if (!this.scriptLoadingPromises[url]) {
      // loadjs会自动处理重复加载的问题，因此此处无需做额外处理
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
    const scriptUrl = `${this.getServePath()}/npm_packages/${url}`

    // 加载图元脚本，其中每个图元在编译时都已经设置到了window根上，以图元url为可以key
    await this.loadScript(scriptUrl)

    // globalThis方式
    if (window[pelLibName]) {
      return window[pelLibName]
    } else {
      if (window.fcLoadCallback) {
        // amd方式， 再后面的define方法中加载完成后会进行回调
        return new Promise((resolve, reject) => {
          window.fcLoadCallbacks[pelLibName] = resolve
        })
      } else {
        return null
      }
    }
  }

  /**
     * 一次性加载多个组件
     * @param {Array} pelList 组件列表
     */
  loadPels (pelList, useLatest) {

  }

  /**
   * 按照图元定义加载图元
   * 图元定义基本如下：
   * {
   *   packageName: '@gw/wind-pels-standard',
   *   version: '1.0.1',   //
   *   name: 'Container',  // 这是图元在包内唯一Name
   *   path: './build/container1.pel.js'
   * }
   * @param {Object} pel 图元定义
   * @param {Boolean} latest 是否使用最新版本，如果是则使用最新版本
   */
  async loadPel (pel, latest) {
    const cache = this.getComponent(pel)

    if (cache) {
      return cache
    }

    try {
      // 先检查React 基础库的加载
      // await this.loadPelExternals(['react', 'react-dom'])

      // 加载组件的依赖包
      await this.confirmPackageDependencies(pel.packageName)

      const componentUrl = this.getPelUrl(pel)
      const pelLibName = this.getComponentLibName(pel)

      await this.loadFCScript(componentUrl, pelLibName)

      // 打包过程中要求将图元包以  `${pel.packageName}/${pel.version}/${pel.path}`方式统一命名图元的名称， 并作为window对象的属性进行挂载，这里就按照这个path来获取
      // path的规则是 包名/版本名/图元名 或者 包名/图元名 版本名同一图元2个版本在一个页面情况下才会用到
      let esModule = window[pelLibName]

      if (!esModule && latest) {
        await this.loadFCScript(this.getPelUrl({
          name: pel.name,
          version: 'latest'
        }), pelLibName)
      }
      esModule = window[pelLibName]

      if (!esModule) {
        log('前端组件无法加载' + pelLibName)
        return null
      }
      const fcp = esModule.default

      // 补充控件基础信息到图元定义
      fcp.pel = pel

      fcp.path = pel.path

      // 对于icon定义中含有图片名后缀，认为是预览图元，设置previewUrl
      const imageNameRegex = /\.(jpg|gif|png|jpeg|svg)$/i

      if (fcp.externals && fcp.externals.length) {
        await this.loadPelExternals(fcp.externals)
      }

      if (fcp.icon && imageNameRegex.test(fcp.icon)) {
        fcp.previewUrl = `${this.getServePath()}/npm_packages/${pel.packageName}/${fcp.icon}`
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

      this.fcCache[componentUrl] = fcp
      return fcp
    } catch (e) {
      log('组件加载异常', e)
      return null
    }
  }

  getPackageJSONUrl (packageName) {
    return `${this.getServePath()}/npm_packages/${packageName}/package.json`
  }

  /**
     * 加载前端组件包的package.json中的dependencies
     * @param pel
     * @returns {Promise<void>}
     */
  async confirmPackageDependencies (packageName) {
    // 直接使用unpkg方式获取package.json
    if (this.packageNotInstalled.indexOf(packageName) > -1) {
      // 包无法加载，说明未安装，后续组件也就无法加载了
      throw new Error('组件包未安装:' + packageName)
    } else if (!this.packageJSONCache[packageName]) {
      if (this.packageLoadingPromises[packageName]) {
        await this.packageLoadingPromises[packageName]
      } else {
        this.packageLoadingPromises[packageName] = (async () => {
          const packageJSONUrl = this.getPackageJSONUrl(packageName)
          const jsonLoaded = await ky.get(packageJSONUrl).json()

          if (jsonLoaded.name === packageName) {
            // 可以加载到包
            if (jsonLoaded.dependencies) {
              log('加载库依赖', jsonLoaded.name, Object.keys(jsonLoaded.dependencies))
              await this.loadPelExternals(Object.keys(jsonLoaded.dependencies))
            }
            this.packageJSONCache[packageName] = jsonLoaded
          } else {
            this.packageNotInstalled.push(packageName)
            // 包无法加载，说明未安装，后续组件也就无法加载了
            throw new Error('组件包未安装:' + packageName)
          }
        })()
      }
      await this.packageLoadingPromises[packageName]
    }
  }
}
