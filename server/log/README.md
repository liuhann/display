# wind-core-log

核心模块：日志

## install & test

```shell script

npm install
npm run module

```

## publish

```shell script

npm run build
npm version patch
npm publish

```

## 日志配置： 

目前只支持log4js作为底层日志库，配置对象如下
```

{
  log4js: {
         // 输出位置， 可以输出到stdout或者具体文件， 以下定义了3个输出
         appenders: {
             out: { type: 'stdout' },
             app: {
                 type: 'file',
                 filename: 'application.log'
             },
             project: {
                 type: 'file',
                 filename: 'project.log'
             }
         },
         // 分类配置， getLogger方法的名字未指定，就是default
         categories: {
             default: {
                 appenders: ['out', 'app'],
                 level: 'debug'
             },
             project: {
                 appenders: ['project'],
                 level: 'debug'
             }
         }
     },
}

```

详细配置见

https://log4js-node.github.io/log4js-node/index.html

## 使用

logger对外提供2种获取途径:
1. ctx.logger: 默认分类的日志对象
2. ctx.getLogger(categoryName) 获取特定分类的日志对象

**当使用getLogger(category)方式时，为指定对应category则使用默认logger**
```javascript

async (ctx, next) => {
    const logger = ctx.logger;

    logger.debug('requesting ', ctx.query);
    
    ctx.body = {
        code: 200,
        message: 'hello goldwind'
    };

    logger.debug('responsed');
    await next();
}
```


### Logger 接口

```javascript

interface Logger {
    level: string;
    log(...args: any[]): void;
    isLevelEnabled(level?: string): boolean;
    isTraceEnabled(): boolean;
    isDebugEnabled(): boolean;
    isInfoEnabled(): boolean;
    isWarnEnabled(): boolean;
    isErrorEnabled(): boolean;
    isFatalEnabled(): boolean;
    _log(level: string, data: any): void;
    addContext(key: string, value: any): void;
    removeContext(key: string): void;
    clearContext(): void;
    trace(message: any, ...args: any[]): void;
    debug(message: any, ...args: any[]): void;
    info(message: any, ...args: any[]): void;
    warn(message: any, ...args: any[]): void;
    error(message: any, ...args: any[]): void;
    fatal(message: any, ...args: any[]): void;
}

```

