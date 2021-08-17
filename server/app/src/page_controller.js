module.exports = class PageController {
  constructor (pageService) {
    this.pageService = pageService
  }

  initRoutes (app) {
    app.router.post('/page/insert', this.insertPage.bind(this))
    app.router.get('/page/list', this.listPage.bind(this))
  }

  async insertPage (ctx, next) {
    const pageInfo = ctx.request.body
    ctx.body = await this.pageService.insertPage(null, pageInfo)
    await next()
  }

  async listPage (ctx, next) {
    ctx.body = await this.pageService.listPages(null)
    await next()
  }
}
