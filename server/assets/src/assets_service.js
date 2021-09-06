const { BadRequestError, HttpError, NotFoundError, ServiceUnavailableError } = require('wind-core-http')
const download = require('download')
const axios = require('axios')
const fs = require('fs')
const tar = require('tar')
const debug = require('debug')('apollo:assets')
const webpackExternals = require('display-dependecies')
const path = require('path')
const { walkAndCleanFiles, removeCleanedFile } = require('../src/walk_sync')
// compareVersions = require('compare-versions');

const ASSETS_PREFIX = '/assets'
const OFFICIAL_NPM_SERVER = 'https://registry.npmjs.org'

module.exports = class AssetsService {
  constructor (app) {
    this.packageStorage = app.config.assetsPackageStorage || './'
    this.npmServer = app.config.npmServer || OFFICIAL_NPM_SERVER
    this.app = app
    this.appService = app.services.appService
    this.logger = app.logger
  }

  async initRoute (router) {
    // 获取npm版本包的信息
    router.get(ASSETS_PREFIX + '/pkg/info', async (ctx, next) => {
      const { name, version, app } = ctx.query

      ctx.body = await this.getModuleVersionMeta(name, version, app)
      await next()
    })

    // 获取npm版本包的信息
    router.get(ASSETS_PREFIX + '/pkg/fclist', async (ctx, next) => {
      const { name, app, version } = ctx.query

      ctx.body = await this.getPackagePels(app, name, version)
      await next()
    })

    // 获取npm版本包的信息
    router.delete(ASSETS_PREFIX + '/pkg/delete', async (ctx, next) => {
      const { name, version, app } = ctx.query

      ctx.body = await this.getModuleVersionMeta(name, version, app)
      await next()
    })

    // 获取安装NPM包的特定版本
    router.get(ASSETS_PREFIX + '/install', async (ctx, next) => {
      const { name, version, app, dependencies } = ctx.query

      ctx.body = await this.installPackage(name, version, app, dependencies)
      await next()
    })

    // 上传文件服务
    router.post(ASSETS_PREFIX + '/file/upload', async (ctx, next) => {
      const { name, app, filePath } = ctx.query

      const file = ctx.request.files.file

      ctx.body = await this.uploadFile(app, name, filePath, file)
      await next()
    })

    // 删除一个本地NPM包
    router.delete(ASSETS_PREFIX + '/:name+', async (ctx, next) => {
      const { name } = ctx.params

      ctx.body = await this.removePackage(name, ctx.request.query.app)
      await next()
    })

    router.get(ASSETS_PREFIX + '/clean', async (ctx, next) => {
      ctx.body = await this.cleanUnExternalFiles(ctx.request.query.app)

      await next()
    })
  }

  async cleanUnExternalFiles (app) {
    const pkgFolder = await this.appService.getPackageStorage(app || 'default')
    const { externals } = webpackExternals
    const excludeFiles = []
    for (const pack of externals) {
      excludeFiles.push(pack.module + '/package.json')
      if (pack.dist) {
        excludeFiles.push(pack.dist)
      }
      if (pack.style) {
        if (typeof pack.style === 'string') {
          excludeFiles.push(pack.style)
        }
      }
    }

    const toBeClened = walkAndCleanFiles(pkgFolder + '/', excludeFiles)
    removeCleanedFile(toBeClened)
    return {
      toBeClened,
      excludeFiles
    }
  }

  /**
     * 使用 verdaccio 服务器提供的按名称搜索npm包方法，返回包列表
     * @param {String} name 包名称
     */
  async searchPackageByName (name) {
    const response = await axios.get(this.npmServer + '/-/verdaccio/search/' + name)

    return response.data
  }

  async ftSearchPackages (query) {
    const response = await axios.get(OFFICIAL_NPM_SERVER + '/search?q=' + query)

    return response.data
  }

  /**
     * 获取指定模块的的版本信息
     * @param {String} name 模块名称
     * @param {String} [version] 对应模块版本，空值表示获得最新的版本
     * @returns {Object} 版本信息， 如果未找到模块则返回 null
     */
  async getModuleVersionMeta (name, version, app) {
    try {
      if (!name) {
        throw new BadRequestError()
      }

      let pkgFolder = path.resolve(this.packageStorage, name)

      if (app) {
        pkgFolder = path.resolve(await this.appService.getPackageStorage(app), name)
      }
      let pkgData = null

      // 直接获取本地的package.json
      if (fs.existsSync(pkgFolder + '/package.json')) {
        pkgData = JSON.parse(fs.readFileSync(pkgFolder + '/package.json', 'utf8'))
        // pkgData = await fs.readJson(pkgFolder + '/package.json');
      } else {
        try {
          // 未找到则调用私服获取
          const moduleMeta = await axios.get(this.npmServer + '/' + name)

          pkgData = moduleMeta.data
        } catch (e) {
          throw new ServiceUnavailableError('请确保资源中心端服务可访问')
        }
      }

      // 未提供版本号则直接下载最新版本
      const npmversion = version || pkgData['dist-tags'].latest

      this.logger.debug('version:', npmversion)

      // 获取对应版本的数据
      const versionData = pkgData.versions[npmversion]

      if (!versionData) {
        throw new NotFoundError('指定版本未找到')
      }
      return {
        module: pkgData,
        versionData
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        this.logger.error('npm package not found name=%s version=%s', name, version)
        return null
      } else {
        throw err
      }
    }
  }

  /**
     * Node 8 方法,递归创建目录
     * @param {*} dirname
     * @returns
     */
  mkdirsSync (dirname) {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  }

  /**
   * 从npm服务器获取资源包，将资源包下载到本地同时更新资源包库信息
   * @param nam
   * @param version
   * @param app 安装所属的应用
   * @returns {Promise<void>}
   */
  async installPackage (name, version, app, installDep) {
    if (!name) {
      throw new BadRequestError('package name must be provided')
    }
    if (!this.npmServer) {
      throw new HttpError(1005021, 'NPM服务地址未配置')
    }

    const packageInfo = (await axios.get(this.npmServer + '/' + name)).data

    if (packageInfo.error) {
      throw new BadRequestError('组件包未找到:' + this.npmServer + '/' + name)
    }

    let useVersion = version

    if (!useVersion) {
      useVersion = packageInfo['dist-tags'].latest
    }

    if (!packageInfo.versions[useVersion]) {
      throw new BadRequestError('组件包的应用版本未找到:' + name + '-' + useVersion)
    }

    this.logger.debug(`fetch with query name=${name}, version=${version}`)

    let pkgFolder = path.resolve(this.packageStorage, name)

    if (app) {
      pkgFolder = path.resolve(await this.appService.getPackageStorage(app), name)
    }

    // 清空既有目录
    fs.rmdirSync(pkgFolder, {
      recursive: true
    })

    this.mkdirsSync(pkgFolder)

    await download(packageInfo.versions[useVersion].dist.tarball, pkgFolder, {
      filename: 'package.tgz'
    })

    await tar.extract({
      file: `${pkgFolder}/package.tgz`,
      cwd: pkgFolder
    })

    await fs.rmSync(`${pkgFolder}/package.tgz`)

    const fileNames = await fs.readdirSync(`${pkgFolder}/package`)

    fileNames.forEach(async function (fileName) {
      await fs.renameSync(`${pkgFolder}/package/${fileName}`, `${pkgFolder}/${fileName}`)
    })

    const dependencies = packageInfo.versions[useVersion].dependencies
    const installedDependencies = []

    if (dependencies && installDep) {
      for (const dep of Object.keys(dependencies)) {
        const externalModule = webpackExternals.externals.filter(ex => dep === ex.module)[0]

        if (externalModule) {
          await this.installPackage(dep, null, app, false)
        }
        installedDependencies.push(dep)
      }
    }

    return {
      installedDependencies,
      installedPackage: {
        name,
        version: useVersion
      }
    }
  }

  async uploadFile (app, name, filePath, file) {
    let pkgFolder = path.resolve(this.packageStorage, name)

    if (app) {
      pkgFolder = path.resolve(await this.appService.getPackageStorage(app), name)
    }

    const targetPath = path.join(pkgFolder, filePath)

    await fs.copyFileSync(file.path, targetPath)

    return {
      targetPath
    }
  }

  async getPackagePels (app, name, version) {
    let pkgFolder = path.resolve(this.packageStorage, name)

    if (app) {
      pkgFolder = path.resolve(await this.appService.getPackageStorage(app), name)
    }

    if (!fs.existsSync(pkgFolder + '/build')) {
      return {
        list: []
      }
    }

    return {
      list: fs.readdirSync(pkgFolder + '/build').filter(fname => fname.endsWith('.fcp.js'))
    }
  }

  /**
     * 删除本地资源模块
     * @param {String} name 模块名称
     */
  async removePackage (name, app) {
    let pkgFolder = path.resolve(this.packageStorage, name)

    if (app) {
      pkgFolder = path.resolve(await this.appService.getPackageStorage(app), name)
    }

    debug('Remove Package', pkgFolder)

    if (fs.existsSync(pkgFolder)) {
      fs.rmdirSync(pkgFolder, {
        recursive: true
      })
      return {
        deleted: pkgFolder
      }
    } else {
      return {
        deleted: ''
      }
    }
  }
}
