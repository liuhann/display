const bodyParser = require('koa-body')
const cors = require('kcors')
const Router = require('@koa/router')
const { resolve } = require('path')
const serve = require('./koa-patched/koa-static')
const fs = require('fs')
const send = require('./koa-patched/koa-send')
const compress = require('koa-compress')
const session = require('koa-session')
const HttpError = require('./errors/http_error')
const BadRequestError = require('./errors/bad_request_error')
const NotFoundError = require('./errors/not_found_error')
const ConflictError = require('./errors/conflict_error')
const ServiceUnavailableError = require('./errors/service_unavailable_error')
const NotImplementedError = require('./errors/not_implemented_error')
const UnauthorizedError = require('./errors/unauthorized_error')
const HttpErrorCode = require('./errors/err_codes')
const name = require('../package.json').name
const version = require('../package.json').version
const debug = require('debug')('wind:http')

/**
 * koa 通用依赖模块，需要以下配置参数
 * uploadStorage： 上传文件位置  默认为 ./upload_storage
 * uploadQuota： 上传文件大小限额 默认为 50M
 * public： 静态资源托管
 * api：  实例化router位置 默认为/api
 */

module.exports = {
  name,
  version,
  description: 'Http模块',
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ServiceUnavailableError,
  NotImplementedError,
  ...HttpErrorCode,
  created (app) {
    if (app.config.cors) {
      // CORS跨域支持
      app.use(cors(app.config.cors))
    } else {
      app.use(
        cors({
          credentials: true
        })
      )
    }

    // 压缩支持
    app.use(compress({
      br: false // disable brotli
    }))

    app.use(session(app.config.session, app))

    // 请求体解析，包括文件上传处理
    const uploadDir = app.config.uploadStorage
    const bodyParseConfig = {
      multipart: true,
      jsonLimit: app.config.uploadJSONLimit || 50 * 1024 * 1024
    }

    if (uploadDir && fs.existsSync(uploadDir)) {
      bodyParseConfig.formidable = {
        uploadDir,
        maxFileSize: app.config.uploadQuota || 50 * 1024 * 1024 // 设置上传文件大小最大限制，默认50M
      }
      debug('Http模块 上传功能开启, 文件目录' + uploadDir)
    } else {
      debug('Http模块 上传目录不存在 ' + uploadDir)
    }

    if (app.config.bodyParser) {
      Object.assign(bodyParseConfig, app.config.bodyParser)
    }

    app.use(bodyParser(bodyParseConfig))

    // 初始化路由实例
    app.router = app.context.router = new Router()

    // 静态资源托管
    if (app.config.public) {
      // 单独配置，只有一个静态目录
      if (typeof app.config.public === 'string') {
        debug('serve dir:' + app.config.public)
        app.use(serve(app.config.public, {
          directorySlash: true,
          maxage: 30 * 24 * 60 * 60 * 1000
        }))
      } else if (Array.isArray(app.config.public)) {
        // 配置多个静态目录
        for (const publicPath of app.config.public) {
          debug('serve dir:' + publicPath)
          app.use(serve(publicPath, {
            directorySlash: true,
            maxage: 30 * 24 * 60 * 60 * 1000
          }))
        }
      }
    }
    app.middlewares = {}
  },

  ready (app) {

  },

  bootComplete (app) {
    app.HttpError = HttpError
    app.BadRequestError = BadRequestError
    app.ConflictError = ConflictError
    app.NotFoundError = NotFoundError
    app.ServiceUnavailableError = ServiceUnavailableError

    // 对于抛出的HttpError，捕获后转换为状态码+信息的格式， code为指定状态码
    // 未使用 app.on('error') 方式，从洋葱圈模型来看，这里只捕获路由层异常，对于外层中间件发生的异常，这里不做处理
    app.use(async (ctx, next) => {
      try {
        await next()
        // 对托管的静态页面 /index.html的页内前端路由的支持，都发送到index.html
        if (ctx.status === 404) {
          if (app.config.api) {
            // 以API开头，又是404，则直接提示接口未找到
            if (ctx.path.indexOf(app.config.api) === 0) {
              throw new NotFoundError('请求服务的地址未找到：' + ctx.path)
            } else {
              // 非API开头的返回index.html
              if (typeof app.config.public === 'string') {
                await send(ctx, '/index.html', {
                  root: resolve(app.config.public)
                })
              } else if (Array.isArray(app.config.public)) {
                await send(ctx, '/index.html', {
                  root: resolve(app.config.public[0])
                })
              }
            }
          } else {
            throw new NotFoundError('请求服务的地址未找到：' + ctx.path)
          }
        }
      } catch (err) {
        // 这里只捕获HTTPError
        if ((err instanceof HttpError) || (err.code && err.message)) {
          if (app.getLogger && app.getLogger('http').isDebugEnabled()) {
            // 打印相关异常
            app.getLogger('http').debug('HTTP Code=', err.code, err.message)
          }
          ctx.body = {
            code: err.code,
            msg: err.message,
            props: err.props
          }
        } else {
          // 对于非HttpError，底层业务也未做其他拦截和处理，统一封装为500 服务器错误，消息类型为未知异常
          if (app.getLogger) {
            app.getLogger('error').debug('HTTP Code=', err.code, err.message)
          }
          ctx.body = {
            code: '500000',
            msg: 'Internal Server Error',
            error: {
              message: err.message,
              stack: err.stack
            }
          }
        }
      }

      // 对所有正常返回数据进行接口格式化封装，判断需要排除下载等其他返回数据的情况
      if (ctx.body && !(ctx.body.code && (ctx.body.data || ctx.body.msg)) && (ctx.body.constructor.name === 'Object' || ctx.body.constructor.name === 'Array')) {
        ctx.body = {
          code: '0',
          msg: '成功',
          data: ctx.body
        }
      }
    })

    // 实例化router位置
    if (app.config.api) {
      // 增加 api 前缀的处理。 这种方式动态增加router的路由
      app.use(app.context.router.prefix(app.config.api).routes())
    } else {
      app.use(app.context.router.routes())
    }
  }
}
