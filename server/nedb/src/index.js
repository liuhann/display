const NeDB = require('./nedb');
const debug = require('debug')('wind:nedb');
const packageInfo = require('../package.json');

module.exports = {
    name: packageInfo.name,
    version: packageInfo.version,
    description: packageInfo.description,
    NeDB,
    // 模块初始化动作，对于核心模块可以进行koa相关插件注册
    // 业务模块可以进行服务创建
    async created(app) {
        if (app.dataBaseProducer) {
            debug('using Database: NeDB');
            app.dataBaseProducer.setDatabaseImpl(NeDB, app.config.nedb);
        }
    }
};
