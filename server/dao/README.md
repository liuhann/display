# wind-core-dao
核心模块：数据访问层及默认lowdb实现
## 基本用法

```shell script
npm install @gw/wind-core-dao
```

```javascript
async (ctx, next) => {
    // 获取数据集合
    const testColl = ctx.getCollection('test');
   
    // 插入数据
    const inserted = await testColl.insert({
        hello: 1,
        name: 'Your name'
    });

    // 根据Id查找
    const one = await testColl.findOne(inserted.id);
    
    // 列表查询
    const found = await testColl.find({
        hello: 1
    });
  
}

```

## 基本概念

数据访问层定义了2个接口，Collection 和  Database， 二者功能和Mongodb概念类似， 体现的是文档型数据库的相关操作，开发使用接口对数据层进行存取，不必关心具体实现。
具体底层存储可能采取mongodb\pg\sqlite\lowdb等。 本模块内置的是lowdb实现，不需要其他任何服务，数据存储在指定配置的文件夹下。

## 接口定义

Collection
```javascript
/**
 * 文档性数据集合接口
 */
class Collection {
    /**
   * 插入文档
   * 注意同mongodb相同，采用_id为文档的id， 如果object提供_id则使用，否则会自动创建一个唯一_id
   * 若插入的数据主键已经存在，则会抛 DuplicateKeyException 异常，提示主键重复，不保存当前数据。
   * @abstract
   * @param object
   * @return inserted 插入后的对象（含id）
   */
    async insert(object) {}

    /**
     * 更新文档内容。 注意update是整个文档的替换，进行局部替换可使用 $set 关键字 或使用 patch方法
     * 
     * @example
     * 替换一个文档
     * await coll.update({ planet: 'Jupiter' }, { planet: 'Pluton'})
     * $set 替换字段
     * await coll.update({ system: 'solar' }, { $set: { system: 'solar system' } }, { multi: true })
     * $unset 删除字段
     * await coll.update({ planet: 'Mars' }, { $unset: { planet: true } })
     * 
     * @param {Object} query 同find接口查询条件
     * @param {Object} update 更新内容
     * @param {Object} [options] 更新配置
     * @param {Object} [options.multi=false] 批量更新
     * @param {Object} [options.upsert=true] 更新插入
     */
    async update(query, update, options) {}

    /**
     * 更新已存在的文档部分内容
     * 等同于
     * update({ _id: id }, {
     *    $set: object
     * });
     * @abstract
     * @param id 文档标识
     * @param patched 文档要更新的字段集合
     */
    async patch(id, patched) {}

    /**
     * 删除文档, 删除条件可以为对象（删除满足条件的文档）、字符串(删除指定id的文档)、数组(按多个对象或字符串删除)
     * @abstract
     * @example
     * coll.remove(id)
     * coll.remove({query: 'abc'})
     * coll.remove([id1, id2, id3])
     * @param [Array|Object|String] query 查询标识
     */
    async remove(query) {}

    /**
   * 根据id获取一个文档
   * @abstract
   * @param id
   */
    async findOne(id) {}

    /**
   * 判断是否有指定查询条件的文档。具体条件见find参数
   * @param query
   * @return {Boolean}
   */
    async exist(query) {}

    /**
     * 查询满足条件的文档列表
     * @abstract
     * @example
     * 基础条件查询、计数
     * await coll.find({ system: 'solar' });
     * 正则匹配 包含 /ar/
     * await coll.find({ planet: /ar/ });
     * 多条件查询 Finding all inhabited planets in the solar system
     * await coll.find({ system: 'solar', inhabited: true })
     * 对象类型字段的递归查询 
     * await coll.find({ "humans.genders": 2 })
     * 支持的数组查询方式 按数组字段查询
     * await coll.find({ "completeData.planets.name": "Mars" })
     * await coll.find({ "completeData.planets.name": "Jupiter" })
     * 支持的数组查询方式 按下标查询
     * await coll.find({ "completeData.planets.0.name": "Earth" })
     * 操作符 $in. $nin
     * await coll.find({ planet: { $in: ['Earth', 'Jupiter'] } })
     * 按id的多个查找
     * await coll.find({ _id: { $in: ['id1', 'id2', 'id3'] } })
     *  数字比较 $gt $lt
     * await coll.find({ "humans.genders": { $gt: 5 } }
     * 
     * 查询 按名称排序
       const result = await coll.find({}, {
        sort: {
            planet: 1
        },
        skip:1,
        limit: 2
       });
      * 查询投影
       await coll.find({ planet: 'Mars' }, {
        projection: {
            planet: 1, system: 1 
        }
       });
     * @param {Object} query 查询条件
     * @param {Object} sort 指定排序的字段，并使用 1 和 -1 来指定排序的方式，其中 1 为升序排列，而 -1 是用于降序排列。
     * @param {Object} projection 可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）
     * @param {Number} skip 数字参数作为跳过的记录条数。 默认为 0
     * @param {Number} limit 数字参数，该参数指定从读取的记录条数。 默认为 -1 不限制
     * @return {Array} documents 符合条件的文档列表
     */
    async find(query, {
        sort,
        projection,
        skip,
        limit
    }) {}

    /**
     * 按条件查询文档个数
     * @example
     * const count = await coll.count({}); // 3
     * @param {Object} query 查询条件
     */
    async count(query) {}

    /**
     * 清空数据库
     * @abstract
     * @return {Number} 删除的记录个数
     */
    async clean() {}

    /**
    * 字段distinct
    * @param {String} field 对应字段
    * @param {Object} query 条件，同find方法对应条件
    */
    async distinct(field, query) {}
}
```

```javascript
class Database {
    /**
   * 获取集合
   * @param name
   */
    async getCollection(name) {}

    /**
   * 删除数据集合
   * @param name
   */
    async removeCollection(name) {}

    /**
   * 创建数据集合
   */
    async createCollection(name) {}
}
```

## 配置及对象获取


### 默认lowdb配置参数

启动参数

```json
{
  lowdb: {
    store: __dirname // 库地址，默认为lowdb目录
  }
}
```

### 获取数据库对象

```javascript
    app.db  // 获取默认数据库 （保存到db.json）
    app.getDb('name') //获取指定数据库 (保存到name.json)
```

### 获取Coll对象

```javascript
  db.getCollection('coll')
```

## 注意

1. 默认的lowdb只用于少量数据使用 建议<1000
2. lowdb query 暂时不支持sort  projection功能
