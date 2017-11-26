'use strict'
require('./check-versions')()
    //用于检查node跟npm的版本
process.env.NODE_ENV = 'production'
    //变量的开发环境
const ora = require('ora')
    // ora，一个可以在终端显示spinner的插件
const rm = require('rimraf')
    // rm，用于删除文件或文件夹的插件
const path = require('path')
    //使用nodejs自带的文件路径工具
const chalk = require('chalk')
    // chalk，用于在控制台输出带颜色字体的插件
const webpack = require('webpack')
    //使用webpack
const config = require('../config')
    // 加载 config/index.js
const webpackConfig = require('./webpack.prod.conf')
    // 加载 webpack.prod.conf
const spinner = ora('building for production...')
    // 使用 ora 打印出 loading + log
spinner.start()
    // 开始 loading 动画

// 首先将整个dist文件夹以及里面的内容删除，以免遗留旧的没用的文件
// 删除完成后才开始webpack构建打包
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    // 拼接编译输出文件路径
    if (err) throw err
        // 执行webpack构建打包，完成之后在终端输出构建完成的相关信息或者输出报错信息并退出程序
    webpack(webpackConfig, function(err, stats) {
        // 编译成功的回调函数
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
                '  Tip: built files are meant to be served over an HTTP server.\n' +
                '  Opening index.html over file:// won\'t work.\n'
            ))
            //  输出提示信息 ～ 提示用户请在 http 服务下查看本页面，否则为空白页
    })
})