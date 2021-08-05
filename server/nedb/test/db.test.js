/* eslint-disable no-undef */
// eslint-disable-next-line import/first
const DB = require('../src/nedb');

// eslint-disable-next-line no-undef
beforeEach(async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test');

    await coll.insert({
        _id: 'id1',
        planet: 'Mars',
        system: 'solar',
        inhabited: false,
        satellites: ['Phobos', 'Deimos']
    });
    await coll.insert({
        _id: 'id2',
        planet: 'Earth',
        system: 'solar',
        inhabited: true,
        humans: {
            genders: 2,
            eyes: true
        }
    });
    await coll.insert({
        _id: 'id3',
        planet: 'Jupiter',
        system: 'solar',
        inhabited: false
    });
    await coll.insert({
        _id: 'id4',
        planet: 'Omicron Persei 8',
        system: 'futurama',
        inhabited: true,
        humans: { genders: 7 }
    });
    await coll.insert({
        _id: 'id5',
        completeData: {
            planets: [{
                name: 'Earth',
                number: 3
            }, {
                name: 'Mars',
                number: 2
            }, {
                name: 'Pluton',
                number: 9
            }]
        }
    });
});

test('Init db and collection', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test');

    await coll.insert({
        _id: 'id110',
        planet: 'Mars',
        system: 'solar',
        inhabited: false,
        satellites: ['Phobos', 'Deimos']
    });
});

test('Insert and Find', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test'),

        inserted = await coll.insert({
            hello: 'Database',
            field: 1
        });

    expect(inserted.hello).toBe('Database');

    expect(inserted._id != null).toBeTruthy();

    const existed = await coll.exist({
        field: 1
    });

    expect(existed).toBeTruthy();

    const foundOne = await coll.findOne(inserted._id);

    expect(inserted._id === foundOne._id).toBeTruthy();
});

test('Simple Querying', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test'),

        // 基础条件查询、计数
        solar = await coll.find({ system: 'solar' });

    expect(solar.length).toBe(3);

    expect(await coll.count({ system: 'solar' })).toBe(3);

    expect((await coll.find({ planet: /ar/ })).length).toBe(2);
});

test('Mutiple and Deep Query', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test');

    // 多条件查询 Finding all inhabited planets in the solar system
    expect((await coll.find({
        system: 'solar',
        inhabited: true
    })).length).toBe(1);

    // 对象类型字段的递归查询
    expect((await coll.find({ 'humans.genders': 2 })).length).toBe(1);

    // 支持的数组查询方式 按数组字段查询
    expect((await coll.find({ 'completeData.planets.name': 'Mars' })).length).toBe(1);

    expect((await coll.find({ 'completeData.planets.name': 'Jupiter' })).length).toBe(0);

    // 支持的数组查询方式 按下标查询
    expect((await coll.find({ 'completeData.planets.0.name': 'Earth' })).length).toBe(1);
});

test('Operator $in/$gt', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test');

    // 操作符 $in. $nin
    expect((await coll.find({ planet: { $in: ['Earth', 'Jupiter'] } })).length).toBe(2);

    // 按id的多个查找
    expect((await coll.find({ _id: { $in: ['id1', 'id2', 'id3'] } })).length).toBe(3);

    // 数字比较 $gt $lt
    expect((await coll.find({ 'humans.genders': { $gt: 5 } })).length).toBe(1);
});

test('Test Projection Sort and Limit', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test');

    await coll.remove('id5');

    // 查询 按名称排序
    const result = await coll.find({}, {
        sort: {
            planet: 1
        },
        skip: 1,
        limit: 2
    });

    expect(result.length).toBe(2);
    expect(result[0].planet).toBe('Jupiter');
    expect(result[1].planet).toBe('Mars');

    // 查询投影
    const projectResult = await coll.find({ planet: 'Mars' }, {
        projection: {
            planet: 1,
            system: 1
        }
    });

    expect(projectResult.length).toBe(1);
    expect(projectResult[0].system).toBe('solar');
    expect(projectResult[0].planet).toBe('Mars');

    expect(projectResult[0].satellites == null).toBeTruthy();
});

test('Test Update & Patch', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test');

    // 替换一个文档
    await coll.update({ planet: 'Jupiter' }, { planet: 'Pluton' });

    const found = await coll.findOne('id3');

    expect(found.planet).toBe('Pluton');
    expect(found.system == null).toBeTruthy();

    // 更新字段
    expect((await coll.find({ system: 'solar' })).length).toBe(2);

    await coll.update({ system: 'solar' }, { $set: { system: 'solar system' } }, { multi: true });

    expect((await coll.find({ system: 'solar' })).length).toBe(0);
    expect((await coll.find({ system: 'solar system' })).length).toBe(2);

    // 删除字段
    await coll.update({ planet: 'Mars' }, { $unset: { planet: true } });

    expect((await coll.findOne({ planet: 'Mars' })) == null).toBeTruthy();

    const unset = await coll.findOne('id1');

    expect(unset.planet == null).toBeTruthy();
});

test('Test Distinct', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test'),

        // 获取所有星球
        dis = await coll.distinct('planet');

    expect(dis.length).toBe(4);

    // 获取宜居的星球名称
    const qf = await coll.distinct('planet', {
        inhabited: true
    });

    expect(qf.length).toBe(2);
});

test('Test Remove Document', async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test');

    expect((await coll.findOne('id1')) != null).toBeTruthy();
    // 单个删除
    await coll.remove('id1');
    expect((await coll.findOne('id1')) == null).toBeTruthy();

    // 多个删除
    expect((await coll.findOne('id2')) != null).toBeTruthy();
    await coll.remove(['id2', 'id3']);
    expect((await coll.findOne('id2')) == null).toBeTruthy();
    expect((await coll.findOne('id3')) == null).toBeTruthy();

    // 按条件删除
    expect((await coll.findOne('id4')) != null).toBeTruthy();
    await coll.remove({ system: 'futurama' });
    expect((await coll.findOne('id4')) == null).toBeTruthy();
});

afterEach(async() => {
    const db = new DB('./test/db'),
        coll = db.getCollection('test');

    await coll.clean();
});
