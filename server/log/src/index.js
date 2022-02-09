const LogSerivce = require('./log_service'),
    name = require('../package.json').name,
    version = require('../package.json').version,
    description = require('../package.json').description;

module.exports = {
    name,
    version,
    description,

    // 模块初始化动作，对于核心模块可以进行koa相关插件注册
    // 业务模块可以进行服务创建
    async created(app) {
        const logSerivce = new LogSerivce(app.config.log4js || {
            appenders: {
                out: { type: 'stdout' },
                app: {
                    type: 'file',
                    filename: '.log/app.log'
                }
            },
            categories: {
                default: {
                    appenders: ['out', 'app'],
                    level: 'debug'
                }
            }
        });

        app.services.logSerivce = logSerivce;
        // 默认日志logger 设置到ctx 的logger字段
        app.logger = app.context.logger = logSerivce.getLogger();
        // getLogger方法设置为ctx对应方法
        app.getLogger = app.context.getLogger = logSerivce.getLogger;

        app.debug = app.context.debug = app.logger.debug.bind(app.logger);
        app.info = app.context.info = app.logger.info.bind(app.logger);
        app.warn = app.context.warn = app.logger.warn.bind(app.logger);
        app.error = app.context.error = app.logger.error.bind(app.logger);
        app.fatal = app.context.fatal = app.logger.fatal.bind(app.logger);
    },

    // 模块路由注册，对外提供API可在此写api相关地址
    async ready(app) {

    },

    // 启动收尾工作，可以在此执行建库、建索引等一些全局的具体业务操作
    async bootComplete(app) {

    }
};
