/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';
const fs = require('fs'),
    copy = require('../src/copy_folder');

test('Copy ', async() => {
    await copy('./src', './test/src');

    expect(true).toBeTruthy();

    fs.rmdirSync('./test/src', {
        recursive: true
    });
});
