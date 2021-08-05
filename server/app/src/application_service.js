const { ConflictError, BadRequestError, HttpError } = require('wind-core-http')
const fs = require('fs')
const debug = require('debug')('apollo:app')
const url = require('url')
const ObjectID = require('bson-objectid')
const copy = require('./copy_folder')
const PATH_APP = 'apps'
const PATH_TRASH = 'trash'
const PATH_ARCHIVE = 'archived'

/*
* @author 刘晗
* @Date: 2021-04-20 17:00:48
* @Description: 应用管理服务
*/
module.exports = class ApplicationService {
  constructor (app) {
    this.config = Object.assign({
      appRoot: './apollo_store'
    }, app.config)
    this.app = app
    this.dataBaseProducer = app.dataBaseProducer
  }

  /**
     * 获取应用服务下的数据库
     */
  getDb (appName, dbName) {
    if (!appName) {
      appName = 'default'
    }
    if (appName) {
      if (!fs.existsSync(`${this.config.appRoot}/${PATH_APP}/${appName}`)) {
        throw new BadRequestError('不存在这个应用')
      }
      return this.dataBaseProducer.getDb(`${this.config.appRoot}/${PATH_APP}/${appName}/${dbName}`)
    } else {
      return this.dataBaseProducer.getDb(dbName)
    }
  }

  /**
     * 获取应用的npm包存储目录
     * @param {String} appName 应用名称
     * @returns String
     */
  async getPackageStorage (appName) {
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_APP}/${appName}`)) {
      throw new BadRequestError('不存在这个应用')
    }

    if (!fs.existsSync(`${this.config.appRoot}/${PATH_APP}/${appName}/npm_packages`)) {
      await fs.mkdirSync(`${this.config.appRoot}/${PATH_APP}/${appName}/npm_packages`)
    }
    return `${this.config.appRoot}/${PATH_APP}/${appName}/npm_packages`
  }

  getAppStorage (appName) {
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_APP}/${appName}`)) {
      throw new BadRequestError('不存在这个应用')
    }
    return `${this.config.appRoot}/${PATH_APP}/${appName}`
  }

  async ensureDir () {
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_APP}`)) {
      await fs.mkdirSync(`${this.config.appRoot}/${PATH_APP}`, {
        recursive: true
      })
    }
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_TRASH}`)) {
      await fs.mkdirSync(`${this.config.appRoot}/trash`, {
        recursive: true
      })
    }
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_ARCHIVE}`)) {
      await fs.mkdirSync(`${this.config.appRoot}/archived`, {
        recursive: true
      })
    }
    this.appList = await this.updateAppList()
  }

  async create (appObject) {
    if (!appObject.name) {
      throw new BadRequestError('应用名称不能为空')
    }

    if (fs.existsSync(`${this.config.appRoot}/apps/${appObject.name}`)) {
      throw new ConflictError('同名应用已经存在')
    }

    appObject.id = ObjectID().toString()
    fs.mkdirSync(`${this.config.appRoot}/${PATH_APP}/${appObject.name}`)

    fs.writeFileSync(`${this.config.appRoot}/${PATH_APP}/${appObject.name}/app.json`, JSON.stringify(appObject))

    this.appList = this.updateAppList()
    return appObject
  }

  getAppJsonFile (appObject) {
    return `${this.config.appRoot}/${PATH_APP}/${appObject.name}/app.json`
  }

  async update (appObject) {
    if (!appObject.name) {
      throw new BadRequestError('应用名称不能为空')
    }

    if (!fs.existsSync(this.getAppJsonFile(appObject))) {
      throw new BadRequestError('应用不存在')
    }

    const oldInfo = await this.get(appObject.name)

    appObject.updated = new Date()

    appObject.id = oldInfo.id

    fs.writeFileSync(`${this.config.appRoot}/${PATH_APP}/${appObject.name}/app.json`, JSON.stringify(appObject))

    this.appList = this.updateAppList()
    return appObject
  }

  async patch (patchObject) {
    if (!patchObject.name) {
      throw new BadRequestError('应用名称不能为空')
    }

    if (!fs.existsSync(this.getAppJsonFile(patchObject))) {
      throw new BadRequestError('应用不存在')
    }

    const appObject = await this.get(patchObject.name)

    appObject.updated = new Date()

    // id 不允许修改
    delete patchObject.id
    // 更新特定的信息
    Object.assign(appObject, patchObject)

    fs.writeFileSync(`${this.config.appRoot}/${PATH_APP}/${appObject.name}/app.json`, JSON.stringify(appObject))

    this.appList = this.updateAppList()
    return appObject
  }

  getAppList () {
    return this.appList
  }

  updateAppList () {
    const files = fs.readdirSync(`${this.config.appRoot}/${PATH_APP}`)
    const appList = []
    const appRoot = `${this.config.appRoot}/${PATH_APP}`

    debug('update app list', files)
    files.forEach(function (filename) {
      if (fs.statSync(`${appRoot}/${filename}`).isDirectory()) {
        debug('reading file', `${appRoot}/${filename}/app.json`)
        appList.push(JSON.parse(fs.readFileSync(`${appRoot}/${filename}/app.json`)))
      }
    })

    return appList
  }

  /**
     * 获取应用配置信息
     * @param {string} name 应用名称
     */
  async get (name) {
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_APP}/${name}/app.json`)) {
      throw new BadRequestError('应用不存在')
    }
    return JSON.parse(fs.readFileSync(`${this.config.appRoot}/${PATH_APP}/${name}/app.json`))
  }

  /**
     * 获取应用的资源信息
     * @param {string} name 应用名称
     */
  async getAppInstalled (name) {
    let npmPackagesFolder = null

    if (name) {
      npmPackagesFolder = await this.getPackageStorage(name)
    } else {
      npmPackagesFolder = this.app.config.assetsPackageStorage || './'
    }

    const fileNames = await fs.readdirSync(npmPackagesFolder)
    const goldwindPackages = []
    const packages = []

    for (const folder of fileNames) {
      // 处理域下的包，主要解析金风包 @gw
      if (folder.startsWith('@')) {
        const subPackNames = await fs.readdirSync(npmPackagesFolder + '/' + folder)

        for (const sub of subPackNames) {
          const packageInfo = await this.getPackageInfo(npmPackagesFolder + '/' + folder + '/' + sub)

          if (packageInfo) {
            if (folder === '@gw') {
              goldwindPackages.push(packageInfo)
            } else {
              packages.push(packageInfo)
            }
          }
        }
      } else {
        // 处理无域信息的包
        const packageInfo = await this.getPackageInfo(npmPackagesFolder + '/' + folder)

        if (packageInfo) {
          packages.push(packageInfo)
        }
      }
    }

    return {
      gw: goldwindPackages,
      libs: packages
    }
  }

  async getPackageInfo (folder) {
    try {
      return JSON.parse(fs.readFileSync(`${folder}/package.json`))
    } catch (e) {
      return null
    }
  }

  async trashApp (name) {
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_APP}/${name}/app.json`)) {
      throw new BadRequestError('应用不存在')
    }
    fs.renameSync(`${this.config.appRoot}/${PATH_APP}/${name}`, `${this.config.appRoot}/${PATH_TRASH}/${name}-${new Date().getTime()}`)
    this.appList = await this.updateAppList()

    if (this.app.services && this.app.services.resourceService) {
      this.app.services.resourceService.clearResourceDB(name)
    }
  }

  // 发布应用版本
  async publishApp (name, version, desc) {
    const appObject = await this.get(name)

    // 创建归档目录文件夹
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_ARCHIVE}/${name}`)) {
      fs.mkdirSync(`${this.config.appRoot}/${PATH_ARCHIVE}/${name}`)
    }

    if (fs.existsSync(`${this.config.appRoot}/${PATH_ARCHIVE}/${name}/${version}`)) {
      throw new ConflictError('版本号已存在')
    }

    // 更改现有版本信息
    appObject.version = version
    appObject.description = desc
    appObject.published = new Date()
    fs.writeFileSync(`${this.config.appRoot}/${PATH_APP}/${appObject.name}/app.json`, JSON.stringify(appObject))

    // fs.mkdirSync(`${this.config.appRoot}/${PATH_ARCHIVE}/${name}/${version}`);
    await copy(`${this.config.appRoot}/${PATH_APP}/${appObject.name}`, `${this.config.appRoot}/${PATH_ARCHIVE}/${name}/${version}`)

    return {
      name,
      version,
      desc
    }
  }

  /**
     * 回滚：设置应用采取某个特定版本
     * @param {string} name 应用名称
     * @param {string} version 版本号
     */
  async rollbackVersion (name, version) {
    // 指定版本不存在
    if (!fs.existsSync(`${this.config.appRoot}/${PATH_ARCHIVE}/${name}/${version}`)) {
      throw new BadRequestError('指定版本不存在', {
        name,
        version
      })
    }

    await this.trashApp(name)

    await copy(`${this.config.appRoot}/${PATH_ARCHIVE}/${name}/${version}`, `${this.config.appRoot}/${PATH_APP}/${name}`)

    return this.get(name)
  }

  /**
     * 获取应用的版本列表
     * @param {string} name 应用名称
     * @returns {'1.0':{}, '2.0':{}}
     */
  async getAppVersions (name) {
    const versionFolder = `${this.config.appRoot}/${PATH_ARCHIVE}/${name}`

    const result = {}

    if (fs.existsSync(versionFolder)) {
      const paths = await fs.readdirSync(versionFolder)

      for (const path of paths) {
        try {
          const versionData = JSON.parse(fs.readFileSync(`${versionFolder}/${path}/app.json`))

          if (versionData.version === path) {
            result[path] = versionData
          }
        } catch (e) {
          console.error('错误的应用版本目录', `${versionFolder}/${path}`)
        }
      }
    }

    return result
  }
}
