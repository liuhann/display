process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const Boostrap = require('wind-boot') // 启动器
const coreHttp = require('wind-core-http') // http相关中间件 router
const coreDAO = require('wind-core-dao') // 数据存取
const nedbDAO = require('wind-dao-nedb') // Nedb的数据存储实现
const appService = require('wind-app-service') // 资源管理服务
const config = require('./config')

const bootApp = new Boostrap(Object.assign(
  config, {
    packages: [coreHttp, coreDAO, nedbDAO, appService]
  })
)

bootApp.start()
