const { BadRequestError, NotFoundError, ConflictError } = require('wind-core-http')
const ObjectID = require('bson-objectid')

/*
* @author 刘晗
* @Date: 2021-05-12 17:00:48
* @Description: 应用及工程资源管理服务

*/
module.exports = class ResourceService {
  constructor (appService) {
    this.appService = appService
    this.resdbByAppName = {}
  }

  async getResourceDB (appName) {
    if (!this.resdbByAppName[appName]) {
      this.resdbByAppName[appName] = await this.appService.getDb(appName, 'resources')
    }

    return this.resdbByAppName[appName]
  }

  async clearResourceDB (appName) {
    delete this.resdbByAppName[appName]
  }

  /**
     * 创建资源
     * @param {String} app 所属应用名称
     * @param {Object} resource 资源信息
     * @returns
     */
  async create (app, key, resource) {
    const coll = (await this.getResourceDB(app)).getCollection('list')

    Object.assign(resource, {
      modified: new Date(),
      key
    })

    if (resource.id) {
      // 判断id重复
      const existed = await coll.exist({
        id: resource.id
      })

      if (existed) {
        throw new ConflictError('同名id节点存在')
      }
    }

    // 给一个默认的id
    if (!resource.id) {
      resource.id = ObjectID().toString()
    }
    if (resource.pid) {
      // 判断父节点存在
      const parentFound = await coll.exist({
        id: resource.pid
      })

      if (!parentFound) {
        throw new BadRequestError('父节点不存在')
      }
    } else {
      const exist = await coll.exist({
        pid: '-1',
        key
      })

      if (exist) {
        throw new BadRequestError('同名键值根节点已存在')
      }
      resource.pid = '-1'
    }
    return coll.insert(resource)
  }

  async update (app, key, menuObject) {
    const coll = (await this.getResourceDB(app)).getCollection('list')

    if (!menuObject.id) {
      throw new BadRequestError('必须提供要更新节点的id字段', {
        item: menuObject
      })
    }

    // 之前节点是否存在
    const exist = await coll.findOne({
      id: menuObject.id
    })

    if (!exist) {
      throw new BadRequestError('待更新节点不存在 id=' + menuObject.id, {
        item: menuObject
      })
    }

    // 更换父节点的判断
    if (exist.pid !== menuObject.pid) {
      if (menuObject.pid === '-1') {
        throw new BadRequestError('无法更换父节点id：根节点只能存在一个', {
          item: menuObject
        })
      }
      if (exist.pid === '-1') {
        throw new BadRequestError('不能更换根节点的父节点', {
          item: menuObject
        })
      }

      const parentFound = await coll.exist({
        id: menuObject.pid
      })

      if (!parentFound) {
        throw new BadRequestError('父节点不存在')
      }
    }

    const updated = await coll.update({
      id: menuObject.id,
      key
    }, Object.assign(menuObject, {
      key
    }))

    return {
      updated
    }
  }

  /**
     * 按键值得到指定键的根节点
     * @param {*} app 应用名称
     * @param {*} key 键值
     * @returns
     */
  async getRootResources (app, key) {
    const coll = (await this.getResourceDB(app)).getCollection('list')

    return coll.findOne({
      pid: '-1',
      key
    })
  }

  /**
     * 按键值得到指定键的根节点
     * @param {*} app 应用名称
     * @param {*} key 键值
     * @returns
     */
  async getResourceById (app, key, id) {
    const coll = (await this.getResourceDB(app)).getCollection('list')

    return coll.findOne({
      key,
      id
    })
  }

  /**
     * 按键值得到指定树结构信息
     * @param {String} app 应用名称
     * @param {String} key 键值
     * @returns
     */
  async getKeyTree (app, key) {
    const coll = (await this.getResourceDB(app)).getCollection('list')
    const flaternedNodes = await coll.find({
      key
    })
    const root = flaternedNodes.filter(n => n.pid === '-1')[0]

    if (!root) {
      throw new NotFoundError('资源树未找到, key=' + key)
    }
    this.buildNodeChildren(root, flaternedNodes)

    return root
  }

  buildNodeChildren (node, flaternedNodes) {
    const children = flaternedNodes.filter(n => n.pid === node.id)

    children.sort((a, b) => (a.sort || 0) - (b.sort || 0))
    node.children = children

    for (const child of children) {
      this.buildNodeChildren(child, flaternedNodes)
    }
  }

  async remove (app, key, id) {
    const coll = (await this.getResourceDB(app)).getCollection('list')

    const children = await coll.find({
      key,
      pid: id
    })

    if (children.length) {
      for (const node of children) {
        await this.remove(app, key, node.id)
      }
    }

    const removed = await coll.remove({ id })

    return {
      removed
    }
  }
}
