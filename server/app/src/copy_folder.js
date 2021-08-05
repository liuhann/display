const fs = require('fs');

const copy = async function(src, dst) {
    // 读取目录中的所有文件/目录

    if (!fs.existsSync(src)) {
        return;
    }

    if (!fs.existsSync(dst)) {
        fs.mkdirSync(dst);
    }

    const paths = await fs.readdirSync(src);

    paths.forEach(async function(path) {
        var _src = src + '/' + path,
            _dst = dst + '/' + path;

        const srcStat = fs.statSync(_src);

        if (srcStat.isFile()) {
            await fs.copyFileSync(_src, _dst);
        } else {
            if (!fs.existsSync(_dst)) {
                fs.mkdirSync(_dst);
            }
            await copy(_src, _dst);
        }
    });
};

module.exports = copy;
