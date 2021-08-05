/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';
const fs = require('fs'),
    { Producer } = require('@gw/wind-core-dao'),
    { NeDB } = require('@gw/wind-dao-nedb'),
    path = require('path'),
    AppService = require('../src/application_service'),
    MenuService = require('../src/resource_service'),
    storePath = path.resolve(__dirname, './menu_store');

let menuService = null;

beforeAll(async() => {
    fs.mkdirSync(storePath);

    const producer = new Producer();

    producer.setDatabaseImpl(NeDB);
    const appService = new AppService({
        config: {
            appRoot: storePath
        },
        dataBaseProducer: producer
    });

    await appService.ensureDir();

    await appService.create({
        name: 'scada-app',
        icon: './some-icon',
        desc: '1234',
        frame: 'simple',
        skin: 'light',
        img: 'preview.png',
        code: '1243',
        created: new Date(),
        modified: new Date(),
        version: '1.0.0'
    });
    menuService = new MenuService(appService);
});

afterAll(() => {
    fs.rmdirSync(storePath, {
        recursive: true
    });
});

test('Menu Basic Create', async() => {
    const menu1 = await menuService.create('scada-app', 'main-menu', {
        name: '主菜单'
    });

    expect(menu1.name).toBe('主菜单');
    expect(menu1._id != null).toBeTruthy();
    try {
        await menuService.create('scada-app', {
            name: '最新',
            pid: 'xde'
        });
        expect(false).toBeTruthy();
    } catch (e) {
        expect(true).toBeTruthy();
    }
});

test('Menu Tree (Simple)', async() => {
    const menu1 = await menuService.create('scada-app', 'left-nav', {
        name: 'Tree'
    });

    expect(menu1.name).toBe('Tree');

    expect(menu1.id != null).toBeTruthy();

    await menuService.create('scada-app', 'left-nav', {
        pid: menu1.id,
        sort: 0,
        name: 'Node1'
    });

    await menuService.create('scada-app', 'left-nav', {
        pid: menu1.id,
        sort: 1,
        name: 'Node2'
    });

    const rootMenus = await menuService.getRootResources('scada-app', 'left-nav');

    expect(rootMenus.name).toBe('Tree');

    const menuTree = await menuService.getKeyTree('scada-app', 'left-nav');

    expect(menuTree.name).toBe('Tree');

    expect(menuTree.children.length).toBe(2);
    expect(menuTree.children[0].name).toBe('Node1');

    expect(menuTree.children[1].name).toBe('Node2');
});

test('Menu Tree (Complicated)', async() => {
    const menu1 = await menuService.create('scada-app', 'bottom-nav', {
        name: 'TreeRoot'
    });

    expect(menu1.name).toBe('TreeRoot');

    expect(menu1.id != null).toBeTruthy();

    // 测试深层节点
    const node1 = await menuService.create('scada-app', 'bottom-nav', {
            pid: menu1.id,
            sort: 0,
            name: 'Node1'
        }),

        node2 = await menuService.create('scada-app', 'bottom-nav', {
            pid: menu1.id,
            sort: 1,
            name: 'Node2'
        });

    await menuService.create('scada-app', 'bottom-nav', {
        pid: node1.id,
        sort: 0,
        name: 'Node1/Sub1'
    });
    await menuService.create('scada-app', 'bottom-nav', {
        pid: node1.id,
        sort: 1,
        name: 'Node1/Sub2'
    });

    let menuTree = await menuService.getKeyTree('scada-app', 'bottom-nav');

    expect(menuTree.name).toBe('TreeRoot');

    expect(menuTree.children.length).toBe(2);
    expect(menuTree.children[0].name).toBe('Node1');
    expect(menuTree.children[1].name).toBe('Node2');

    expect(menuTree.children[0].children.length).toBe(2);
    expect(menuTree.children[0].children[0].name).toBe('Node1/Sub1');
    expect(menuTree.children[0].children[1].name).toBe('Node1/Sub2');

    // Sort Change
    await menuService.update('scada-app', 'bottom-nav', {
        id: node1.id,
        pid: menu1.id,
        sort: 2,
        name: 'Node1',
        icon: 'Great',
        frame: 'someFrame'
    });

    menuTree = await menuService.getKeyTree('scada-app', 'bottom-nav');

    expect(menuTree.children[0].name).toBe('Node2');
    expect(menuTree.children[1].name).toBe('Node1');

    // Change Pid (Move)
    await menuService.update('scada-app', 'bottom-nav', {
        id: node1.id,
        pid: node2.id,
        sort: 2,
        name: 'Node1',
        icon: 'Great',
        frame: 'someFrame'
    });
    menuTree = await menuService.getKeyTree('scada-app', 'bottom-nav');
    expect(menuTree.children.length).toBe(1);
    expect(menuTree.children[0].children.length).toBe(1);
    expect(menuTree.children[0].children[0].name).toBe('Node1');
    expect(menuTree.children[0].children[0].children.length).toBe(2);

    await menuService.remove('scada-app', 'bottom-nav', node1.id);

    menuTree = await menuService.getKeyTree('scada-app', 'bottom-nav');
    expect(menuTree.children.length).toBe(1);
    expect(menuTree.children[0].children.length).toBe(0);
    expect(menuTree.children[0].name).toBe('Node2');
});

test('Menu Tree Modify', async() => {
    const menu1 = await menuService.create('scada-app', 'tree-modify', {
        name: 'TreeRoot'
    });

    expect(menu1.name).toBe('TreeRoot');

    expect(menu1.id != null).toBeTruthy();

    // 测试深层节点
    const node1 = await menuService.create('scada-app', 'tree-modify', {
        pid: menu1.id,
        sort: 0,
        name: 'Node1',
        icon: 'Great',
        frame: 'someFrame'
    });

    expect(node1.frame).toBe('someFrame');
    expect(node1.sort).toBe(0);

    await menuService.update('scada-app', 'tree-modify', {
        id: node1.id,
        pid: menu1.id,
        key: 'tree-modify',
        sort: 2,
        name: 'Node123',
        icon: 'Great',
        frame: 'someFrame'
    });

    const found = await menuService.getResourceById('scada-app', 'tree-modify', node1.id);

    expect(found.name).toBe('Node123');
    expect(found.sort).toBe(2);
});
