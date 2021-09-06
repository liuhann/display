process.env.DEBUG = 'wind:*'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const Boostrap = require('wind-boot') // 启动器
const coreHttp = require('wind-core-http') // http相关中间件 router
const coreDAO = require('wind-core-dao') // 数据存取
const coreLog = require('wind-core-log') // 日志服务
const nedbDAO = require('wind-dao-nedb') // Nedb的数据存储实现
const appService = require('wind-app-service') // 资源管理服务
const assetService = require('wind-assets-service')
const config = require('./config')

const bootApp = new Boostrap(Object.assign(
  config, {
    packages: [coreHttp, coreLog, coreDAO, nedbDAO, appService, assetService]
  })
)

bootApp.start()
