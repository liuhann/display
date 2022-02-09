module.exports = class ResourceController {
  constructor (resourceService) {
    this.resourceService = resourceService
  }

  initRoutes (app) {
    app.router.post('/app/:app/:key/add', this.createResource.bind(this))
    app.router.get('/app/:app/:key/detail', this.resourceDetail.bind(this))
    app.router.post('/app/:app/:key/update', this.updateResource.bind(this))
    app.router.get('/app/:app/:key/tree', this.resourceTree.bind(this))
    app.router.delete('/app/:app/:key/:id', this.deleteResource.bind(this))
  }

  async createResource (ctx, next) {
    const resourceInfo = ctx.request.body
    const { app, key } = ctx.request.params

    ctx.body = await this.resourceService.create(app, key, resourceInfo)
    await next()
  }

  async resourceDetail (ctx, next) {
    const { id } = ctx.request.query
    const { app, key } = ctx.request.params

    ctx.body = await this.resourceService.getResourceById(app, key, id)

    await next()
  }

  async resourceTree (ctx, next) {
    const { app, key } = ctx.request.params

    ctx.body = await this.resourceService.getKeyTree(app, key)

    await next()
  }

  async updateResource (ctx, next) {
    const resourceInfo = ctx.request.body
    const { app, key } = ctx.request.params

    ctx.body = await this.resourceService.update(app, key, resourceInfo)
    await next()
  }

  async deleteResource (ctx, next) {
    const { app, key, id } = ctx.request.params

    ctx.body = await this.resourceService.remove(app, key, id)
    await next()
  }
}
