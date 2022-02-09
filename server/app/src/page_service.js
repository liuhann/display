const fs = require('fs')
const PATH_APP = 'apps'
const DB_NAME = 'display'
const PAGE_COLL_NAME = 'pages'

/*
* @author 刘晗
* @Date: 2021-04-20 17:00:48
* @Description: 应用管理服务
*/
module.exports = class PageService {
  constructor (app) {
    this.app = app
    this.dataBaseProducer = app.dataBaseProducer
    this.appService = app.services.appService
    this.config = Object.assign({
      appRoot: './app_store'
    }, app.config)
    this.pageColls = {}
  }

  async insertPage (appName, pageData) {
    const pageColl = await this.getPageColl(appName)

    const result = await pageColl.insert(pageData)
    return result
  }

  async listPages (appName) {
    const pageColl = await this.getPageColl(appName)

    const result = await pageColl.find({}, {
      projection: {
        name: 1,
        createdAt: 1,
        updatedAt: 1
      }
    })

    return result
  }

  async getPageColl (appName = 'default') {
    if (!this.pageColls[appName]) {
      const db = await this.appService.getDb(appName, DB_NAME)
      this.pageColls[appName] = db.getCollection(PAGE_COLL_NAME)
    }
    return this.pageColls[appName]
  }
}
