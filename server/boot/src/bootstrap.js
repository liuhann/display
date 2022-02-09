const Koa = require('koa')
const http = require('http')
const https = require('https')
const httpProxy = require('http-proxy')
const parser = require('co-body')
const queryString = require('querystring')
const createPathRewriter = require('./path_rewriter.js')
const fs = require('fs')
const debug = require('debug')('wind:boot')

class BootStrap {
  constructor (config) {
    this.config = Object.assign({
      // port: 8080, // REST服务端口
      // httpsPort: 8091,
      public: './public', // 静态资源托管
      api: '/api',
      packages: [] // 模块列表，按序启动
    }, config)
  }

  async start () {
    const app = new Koa()

    // 设置booter到app
    app.booter = this

    app.config = this.config

    app.services = app.context.services = {}
    if (this.config.packages) {
      app.packages = app.context.packages = this.config.packages.filter(packageModule => !packageModule.disabled)
      delete this.config.packages
    }

    debug('config %O', this.config)

    Object.freeze(this.config)
    this.app = app

    // 复制支持proxy反向代理功能，需要设置 config.proxy
    const callback = this.getProxyEnabledCallback()

    let listened = false

    // 声明了port参数，才会启动http服务
    if (this.config.port) {
      app.httpServer = http.createServer(callback).listen(this.config.port)
      listened = true
      debug('√ http listening port: ' + this.config.port)
    }

    // 声明了httpsPort参数，才会启动https服务
    if (this.config.httpsPort && this.config.httpsKey && this.config.httpsCert) {
      app.httpsServer = https.createServer({
        key: fs.readFileSync(this.config.httpsKey),
        cert: fs.readFileSync(this.config.httpsCert)
      }, callback).listen(this.config.httpsPort)
      debug('√ https listening port: ' + this.config.httpsPort)
      listened = true
    }

    // 加载所有模块、初始化服务实例、调用模块created方法
    await this.packagesCreated()

    // 服务依赖的自动注入 使用_service方式
    await this.initPackageService()

    // 调用模块的ready方法
    await this.packagesReady()

    // 启动收尾，供系统级应用做最后的绑定
    await this.bootComplete()

    const bootFailed = app.packages.filter(p => p.err)

    if (bootFailed.length) {
      debug('以下模块启动失败')
      for (const packageModule of bootFailed) {
        debug(`${packageModule.description || ''}[${packageModule.name}]`)
      }
    }

    debug('√ boot complete')

    if (!listened) {
      debug('× No http or https port listening, server exited')
      debug('-> Add config.port or config.httpsPort to start http service')
    }
  }

  /**
     * 复制支持proxy反向代理功能，需要设置 config.proxy
     * @returns http.RequestListener 端口监听处理函数
     */
  getProxyEnabledCallback () {
    const proxyPaths = Object.keys(this.config.proxy || {})// 代理的路径列表

    // 未设置proxy则直接取koa的默认callback
    if (proxyPaths.length === 0) {
      return this.app.callback()
    }

    for (const proxyPath of proxyPaths) {
      if (this.config.proxy[proxyPath].pathRewrite) {
        this.config.proxy[proxyPath].pathRewriter = createPathRewriter(this.config.proxy[proxyPath].pathRewrite)
      }
    }

    // rewrite path
    const applyPathRewrite = (req, pathRewriter) => {
      if (pathRewriter) {
        const path = pathRewriter(req.url, req)

        if (typeof path === 'string') {
          req.url = path
        } else {
          debug('[HPM] pathRewrite: No rewritten path found. (%s)', req.url)
        }
      }
    }
    const proxy = httpProxy.createProxyServer({})

    // 暴露proxy供应用进一步配置
    this.app.proxy = proxy

    // 带有proxy处理的callback
    const callback = (req, res) => {
      const path = req.url

      // 首先处理proxy路由，如果是api代理 则使用代理，不进koa
      for (const proxyPath of proxyPaths) {
        if (path.startsWith(proxyPath)) { // 此处判断只按 startWith方式， 未来考虑使用正则等方式增加功能
          const originalUrl = req.url

          if (this.config.proxy[proxyPath].pathRewriter) {
            applyPathRewrite(req, this.config.proxy[proxyPath].pathRewriter)
          }
          debug('Proxy: ' + originalUrl + '-->' + this.config.proxy[proxyPath].target + req.url)
          if (this.config.proxy[proxyPath].writeLog || this.config.proxy[proxyPath].bodyLog) {
            req.ctx = this.app.createContext(req, res)
            // 传递ctx到proxy后续处理之中
            // 这里解析请求体到req.body， 供其他回调场合使用
            parser(req).then(body => {
              req.body = body
              proxy.web(req, res, this.config.proxy[proxyPath])
            })
          } else {
            proxy.web(req, res, this.config.proxy[proxyPath])
          }
          // 包含此路径则后续交给proxy，不进koa处理
          return
        }
      }
      // 非proxy路径照旧进入koa callback
      this.app.callback()(req, res)
    }

    proxy.on('proxyReq', function (proxyReq, req) {
      // 如果路径处理过body，则需要重新生成req。
      if (req.body) {
        const contentType = proxyReq.getHeader('Content-Type')
        let bodyData

        if (contentType === 'application/json') {
          bodyData = JSON.stringify(req.body)
        }

        if (contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
          bodyData = queryString.stringify(req.body)
        }

        if (bodyData) {
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
          proxyReq.write(bodyData)
        }
      }
    })

    return callback
  }

  async stop () {
    debug('stopping server')
    if (this.app.proxy) {
      this.app.proxy.close()
    }
    if (this.app.httpServer) {
      this.app.httpServer.close()
      debug('httpServer stopped')
    }
    if (this.app.httpsServer) {
      this.app.httpsServer.close()
      debug('httpServer stopped')
    }
  }

  async restart () {
    debug('stoppin server')
    this.httpServer.close(async err => {
      debug('listing port stopped')
      if (err) {
        debug('error:')
        debug(err)
      }
      debug('restarting .......')
      await this.start()
    })
  }

  /**
     * 模块进行依次加载并依次调用模块的created方法，
     * created方法主要是工作是系统类模块进行koa插件注册、业务模块进行对外服务初始化并挂载到app上
     * @return {Promise<void>}
     **/
  async packagesCreated () {
    for (let i = 0; i < this.app.packages.length; i++) {
      const packageModule = this.app.packages[i]

      delete packageModule.err
      debug(`preparing module ${packageModule.description || ''}[${packageModule.name}]..`)
      if (packageModule.created) {
        try {
          await packageModule.created(this.app)
        } catch (e) {
          debug(`module created fail: ${packageModule.name}`)
          debug('error %O', e)
          packageModule.err = e
          continue
        }
      }
    }
  }

  /**
     * 进行服务的自动发现、注册
     * 规则就是按名称进行匹配 _不进行注入
     * @return {Promise<void>}
     */
  async initPackageService () {
    // fulfill service dependencies
    const services = this.app.services

    for (const serviceName in services) {
      // service list
      const constructorDefinedRefs = Object.getOwnPropertyNames(services[serviceName])

      debug('service ' + serviceName + ':' + (typeof constructorDefinedRefs))
      // iterate fields of service
      for (const refName of constructorDefinedRefs) {
        // inject service by name
        if (!refName.startsWith('_') && // field start with underline is considered not to be service
          services[serviceName][refName] == null) {
          services[serviceName][refName] = services[refName]
        }
      }
    }
  }

  /**
     * 模块初始化相关处理
     * @return {Promise<void>}
     */
  async packagesReady () {
    // 按模块添加次序顺讯运行
    for (let i = 0; i < this.app.packages.length; i++) {
      const packageModule = this.app.packages[i]

      // 前面出错的模块不再继续执行
      if (packageModule.err) {
        continue
      }
      try {
        if (packageModule.ready) {
          await packageModule.ready(this.app)
        } else if (typeof packageModule === 'function') {
          await packageModule(this.app)
        }
      } catch (err) {
        // ignore failed module
        debug(`module ${packageModule.name} ready failed:`, err)
        packageModule.err = err
      }
    }
  }

  /**
     * 模块启动完成回调
     * @return {Promise<void>}
     */
  async bootComplete () {
    // 结束时按模块次序反向执行。保证前面的模块最后收尾
    for (let i = this.app.packages.length - 1; i >= 0; i--) {
      const packageModule = this.app.packages[i]

      if (packageModule.err) {
        continue
      }
      try {
        packageModule.bootComplete && await packageModule.bootComplete(this.app)
      } catch (err) {
        // ignore failed module
        debug(`module ${packageModule.name} complete failed:`, err)
        packageModule.err = err
      }
    }
  }

  async loadPackage (packageModule) {
    try {
      if (packageModule.created) {
        await packageModule.created(this.app)
      }
      if (packageModule.ready) {
        packageModule.ready(this.app)
      } else if (typeof packageModule === 'function') {
        packageModule(this.app)
      }
      return 'success'
    } catch (err) {
      // 模块加载失败
      debug(err)
      packageModule.err = err
      return err
    }
  }
}
module.exports = BootStrap
