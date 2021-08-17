const AppService = require('./application_service.js')
const ResourceService = require('./resource_service.js')
const PageService = require('./page_service.js')

const AppController = require('./app_controller.js')
const ResourceController = require('./res_controller.js')
const PageController = require('./page_controller.js')

module.exports = {
  name: 'app-service',
  description: '组态应用管理服务',

  // 模块初始化动作，对于核心模块可以进行koa相关插件注册
  // 业务模块可以进行服务创建
  async created (app) {
  },

  // 模块路由注册，对外提供API可在此写api相关地址
  async ready (app) {
    app.services.appService = new AppService(app)
    app.services.resourceService = new ResourceService(app.services.appService)
    app.services.pageService = new PageService(app)

    await app.services.appService.ensureDir()

    const appController = new AppController(app.services.appService)
    const resController = new ResourceController(app.services.resourceService)
    const pageController = new PageController(app.services.pageService)
    await appController.initRoutes(app)
    await resController.initRoutes(app)
    await pageController.initRoutes(app)

    console.log('app ready')
  },

  // 启动收尾工作，可以在此执行建库、建索引等一些全局的具体业务操作
  async bootComplete (app) {

  }
}
