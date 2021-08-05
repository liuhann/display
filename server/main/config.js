process.env.DEBUG = 'wind:*' // see https://www.npmjs.com/package/debug
const storeRoot = './app_store'

module.exports = {
  // HTTP服务端口，不配置则不启动http服务
  port: 80,
  // HTTP服务端口 httpsPort Key Cert 三个都配置才能启动https服务
  httpsPort: 443,
  // https key
  httpsKey: './key/server_private.key',
  // https cert
  httpsCert: './key/server.crt',
  appRoot: storeRoot,
  // npm 全局资源服务器地址，非研发环境无法访问。应用内的资源安装时使用
  npmServer: 'https://registry.npmjs.org',
  proxy: {
    // 操作模型下发代理地址
    '/proxy/apollo': {
      target: 'http://10.10.0.57:8091',
      pathRewrite: {
        '^/proxy/apollo': '/apollo'
      },
      secure: false
    },
    // 可配置的第三方服务地址 样例
    '/proxy/weather': {
      target: 'http://www.weather.com.cn',
      pathRewrite: {
        '^/proxy/weather': ''
      }
    }
  },
  // 启用CORS 默认启用
  cors: {
    credentials: true
  },
  // 静态托管地址， 默认使用应用的public目录、 110版本存储目录及应用部署根目录
  public: [storeRoot + '/public', storeRoot + '/users'],
}
