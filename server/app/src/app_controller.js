const { BadRequestError } = require('wind-core-http')

module.exports = class AppController {
  constructor (appService) {
    this.appService = appService
  }

  initRoutes (app) {
    app.router.post('/app/login', this.loginApp.bind(this))
    app.router.get('/app/byname/:name', this.getAppInfo.bind(this))
    app.router.post('/app/create', this.createApp.bind(this))
    app.router.post('/app/update', this.updateApp.bind(this))
    app.router.post('/app/patch', this.patchApp.bind(this))
    app.router.post('/app/trash', this.trashApp.bind(this))
    app.router.get('/app/list', this.listApp.bind(this))
    app.router.post('/app/publish', this.publishApp.bind(this))
    app.router.post('/app/rollback', this.rollbackApp.bind(this))
    app.router.get('/app/version/list', this.getAppVersionList.bind(this))
    app.router.get('/app/packages', this.getAppInstalled.bind(this))
  }

  async loginApp (ctx, next) {
    let { user, pwd } = ctx.request.body

    if (!user) {
      user = ctx.query.user
    }
    if (!pwd) {
      user = ctx.query.pwd
    }

    if (!user || !pwd) {
      throw new BadRequestError('用户名和密码必须提供')
    }

    ctx.body = await this.appService.loginToGoldWind(user, pwd)

    await next()
  }

  async getAppInfo (ctx, next) {
    const { name } = ctx.request.params

    ctx.body = await this.appService.get(name)
    await next()
  }

  async createApp (ctx, next) {
    const appInfo = ctx.request.body

    ctx.body = await this.appService.create(appInfo)
    await next()
  }

  async updateApp (ctx, next) {
    const appInfo = ctx.request.body

    ctx.body = await this.appService.update(appInfo)
    await next()
  }

  async patchApp (ctx, next) {
    const appInfo = ctx.request.body

    ctx.body = await this.appService.patch(appInfo)
    await next()
  }

  async listApp (ctx, next) {
    ctx.body = {
      apps: this.appService.getAppList()
    }
    await next()
  }

  async trashApp (ctx, next) {
    const { name } = ctx.request.body

    ctx.body = {
      apps: this.appService.trashApp(name)
    }
    await next()
  }

  async publishApp (ctx, next) {
    const { name, version, description } = ctx.request.body

    if (!name || !version) {
      throw new BadRequestError('应用名称和版本号必须提供', ctx.request.body)
    }

    ctx.body = await this.appService.publishApp(name, version, description)

    await next()
  }

  async getAppVersionList (ctx, next) {
    const { name } = ctx.request.query

    if (!name) {
      throw new BadRequestError('应用名称必须提供', ctx.request.body)
    }

    ctx.body = await this.appService.getAppVersions(name)

    await next()
  }

  async getAppInstalled (ctx, next) {
    const { name } = ctx.request.query

    ctx.body = await this.appService.getAppInstalled(name)

    await next()
  }

  async rollbackApp (ctx, next) {
    const { name, version } = ctx.request.body

    if (!name || !version) {
      throw new BadRequestError('应用名称和版本必须提供', ctx.request.body)
    }

    ctx.body = await this.appService.rollbackVersion(name, version)

    await next()
  }
}
