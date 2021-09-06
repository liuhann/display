const log4js = require('log4js');

class LogService {
    constructor(config) {
        this.config = config;
        log4js.configure(config);
    }

    getLogFiles () {
        return Object.values(this.config.appenders).filter(appender => appender.type === 'file').map(appender => appender.filename)
    }

    getLogger(name) {
        const logger = log4js.getLogger(name);

        return logger;
    }
}
module.exports = LogService;
