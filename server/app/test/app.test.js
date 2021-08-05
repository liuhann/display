/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';
const fs = require('fs'),
    path = require('path'),
    AppService = require('../src/application_service'),
    storePath = path.resolve(__dirname, './apollo_store');

beforeAll(() => {
    fs.mkdirSync(storePath);
});

afterAll(() => {
    fs.rmdirSync(storePath, {
        recursive: true
    });
});

test('Login ', async() => {
    const appService = new AppService({
        config: {
            appRoot: storePath
        }
    });

    await appService.ensureDir();
    try {
        const response = await appService.loginToGoldWind('liuhan@goldwind.com.cn', Buffer.from('自己改密码测试'.toString(16)).toString('base64'));

        console.log(response);
    } catch (e) {}

    // expect(true).toBeTruthy();
});

test('Base Create App', async() => {
    const appService = new AppService({
        config: {
            appRoot: storePath
        }
    });

    await appService.ensureDir();

    const created = await appService.create({
        name: 'scada-app',
        icon: './some-icon',
        desc: '1234',
        frame: 'simple',
        skin: 'tech-blue',
        img: 'preview.png',
        code: '1243',
        created: new Date(),
        modified: new Date(),
        version: '1.0.0'
    });

    expect(created.desc).toBe('1234');
});

test('Base Update App', async() => {
    const appService = new AppService({
        config: {
            appRoot: storePath
        }
    });

    await appService.ensureDir();

    const got = await appService.get('scada-app');

    expect(got.version).toBe('1.0.0');

    const created = await appService.update({
        name: 'scada-app',
        icon: './some-icon',
        desc: '1234',
        frame: 'simple',
        skin: 'light',
        img: 'preview.png',
        code: '1243',
        created: new Date(),
        modified: new Date(),
        version: '1.0.1'
    });

    expect(created.version).toBe('1.0.1');
});

test('App List', async() => {
    const appService = new AppService({
        config: {
            appRoot: storePath
        }
    });

    await appService.ensureDir();

    await appService.create({
        name: 'soam-app',
        icon: './some-icon',
        desc: '1234',
        frame: 'simple',
        skin: 'light',
        img: 'preview.png',
        code: '1243',
        version: '1.0.0'
    });

    const result = await appService.getAppList();

    expect(result.length).toBe(2);
});

test('App Trash', async() => {
    const appService = new AppService({
        config: {
            appRoot: storePath
        }
    });

    await appService.ensureDir();
    await appService.trashApp('soam-app');

    try {
        await appService.get('soam-app');
    } catch (e) {
        expect(true).toBeTruthy();
    }
});

test('App Version', async() => {
    const appService = new AppService({
        config: {
            appRoot: storePath
        }
    });

    await appService.ensureDir();

    await appService.create({
        name: 'soam-app',
        icon: './some-icon',
        desc: '1234',
        frame: 'simple',
        skin: 'light',
        img: 'preview.png',
        code: '1243',
        version: '1.0.0'
    });

    appService.publishApp('soam-app', '1.0.1', '增加了一些描述');
});

test('App Version List', async() => {
    const appService = new AppService({
        config: {
            appRoot: storePath
        }
    });

    await appService.ensureDir();

    await appService.create({
        name: 'soam-version-x',
        icon: './some-icon',
        desc: '1234',
        frame: 'simple',
        skin: 'light',
        img: 'preview.png',
        code: '1243',
        version: '1.0.0'
    });

    await appService.publishApp('soam-version-x', '1.0.1', '增加了一些描述');
    await appService.publishApp('soam-version-x', '1.0.2', '增加了另一些描述');

    const versions = await appService.getAppVersions('soam-version-x');

    expect(versions['1.0.1'] != null).toBeTruthy();
    expect(versions['1.0.2'] != null).toBeTruthy();

    expect(versions['1.0.2'].version).toBe('1.0.2');
    expect(versions['1.0.2'].description).toBe('增加了另一些描述');
});

test('Rollback App', async() => {
    const appService = new AppService({
        config: {
            appRoot: storePath
        }
    });

    await appService.ensureDir();

    await appService.create({
        name: 'soam-version-r',
        icon: './some-icon',
        desc: '1234',
        frame: 'simple',
        skin: 'light',
        img: 'preview.png',
        code: '1243',
        version: '1.0.0'
    });

    await appService.publishApp('soam-version-r', '1.0.1', '增加了一些描述');
    await appService.publishApp('soam-version-r', '1.1.2', '增加了另一些描述');

    const versions = await appService.getAppVersions('soam-version-r');

    expect(versions['1.0.1'] != null).toBeTruthy();
    expect(versions['1.1.2'] != null).toBeTruthy();

    await appService.update({
        name: 'soam-version-r',
        icon: './some-icon',
        description: '我的描述信息',
        frame: 'complicated',
        skin: 'light',
        img: 'preview.png',
        code: '1243',
        version: '1.0.0'
    });

    let appInfo = await appService.get('soam-version-r');

    expect(appInfo.frame).toBe('complicated');

    await appService.rollbackVersion('soam-version-r', '1.1.2');

    appInfo = await appService.get('soam-version-r');

    expect(appInfo.frame).toBe('simple');
    expect(appInfo.version).toBe('1.1.2');
});
