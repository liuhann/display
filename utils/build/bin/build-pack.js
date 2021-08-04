const path = require('path'),
    webpack = require('webpack'),
    glob = require('glob'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    { merge } = require('webpack-merge'),
    ProgressPlugin = require('webpack/lib/ProgressPlugin'),
    webpackExternals = require('display-3rd-dependecies'),
    webpackCommonBase = require('./webpack.common.js'),
    chalk = require('chalk');

const log = console.log,
    BUILD_PATH = 'build',

    promiseGlob = async(pattern, opts) => {
        return new Promise((resolve, reject) => {
            glob(pattern, opts, (er, files) => {
                if (er) {
                    reject(er);
                } else {
                    resolve(files);
                }
            });
        });
    },

    /**
     * 打包npm模块中的所有图元
     * @param packagePath npm模块路径
     * @returns {Promise<void>}
     */
    build = async function(packagePath) {
        log(chalk.green('工程目录：', path.resolve(packagePath, './package.json')));

        const packageJson = require(path.resolve(packagePath, './package.json'));

        const targetFiles = await promiseGlob('./src/**/*.fcp.js'),

            entry = {};

        if (targetFiles.length === 0) {
            log(chalk.green('未找到图元 ./src/**/*.fcp.js'));
        }
        log(chalk.green('编译打包以下图元文件'));

        for (let i = 0; i < targetFiles.length; i++) {
            const file = targetFiles[i];

            log(chalk.green(file));
            entry[path.basename(path.resolve(file, '../')) + '-' + path.basename(file, '.js')] = file;
        }
        // 读取配置好的external目录
        const externals = {};

        // 这里依赖到 @gw/wind-pack-externals， 这就需要编译前端组件的项目能随时更新到最新的external配置。
        // 另外的办法是在此获取web api的配置，但是缺点是无版本追踪
        log(chalk.green('以下依赖不加入组件包'));
        for (const external of webpackExternals.externals) {
            log(chalk.green(external.module));
            externals[external.module] = external.root || external.module;
        }

        const myArgs = process.argv.slice(2),

            argsConfig = {};

        // 不压缩代码
        if (myArgs.indexOf('--no-minimize') > -1 || myArgs.indexOf('-nm') > -1) {
            argsConfig.optimization = {
                // We no not want to minimize our code.
                minimize: false
            };
        }

        // 创建webpack 编译器  这里使用webpack api方式进行编译
        const compiler = webpack(merge({
                entry,
                output: {
                    filename: chunkData => {
                        return chunkData.chunk.name.substring(0, chunkData.chunk.name.indexOf('.')) + '.fcp.js';
                    },
                    // filename: '[name].js',
                    // 图元的全局唯一ID (pelUId) 也是图元的下载地址
                    library: `${packageJson.name}/${BUILD_PATH}/[name].js`,
                    // 代码输出格式，amd方式将依赖也输出到define上，未来在运行时需要针对amd加载做相关处理
                    libraryTarget: 'this',
                    // 如果代码中有import() 异步引入的部分，打包后会自动增加server地址前缀
                    // publicPath: `${NPM_SERVER}/${packageJson.name}/${packageJson.version}/${BUILD_PATH}/`,
                    publicPath: './',
                    // 编译输出到项目BUILD_PATH目录下
                    path: path.resolve(packagePath, './' + BUILD_PATH)
                },
                plugins: [
                    new CleanWebpackPlugin()
                ]
            }, webpackCommonBase, {
                externals
            }, argsConfig)),
            // 引用 ProgressPlugin 打印编译过程进度详情
            // eslint-disable-next-line no-shadow-restricted-names
            progressPlugin = new ProgressPlugin(function(percentage, msg, ...arguments) {
                let info = arguments ? arguments.join(' ') : '';

                if (msg === 'building modules' && arguments[2]) {
                    const splits = arguments[2].split('!');

                    info = splits[splits.length - 1];
                }
                console.log(Math.floor(percentage * 100) + '%', msg, info);
            });

        progressPlugin.apply(compiler);

        // 执行编译
        compiler.run((err, stats) => {
            if (err) {
                throw err;
            }
            // 打印编译结果及编译异常
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
                chunks: false,
                chunkModules: true
            }) + '\n\n');
            if (stats.hasErrors()) {
                console.log('  Build failed with errors.\n');
                process.exit(1);
            }
            console.log('  Build complete.\n');
        });
    };

build('./');
