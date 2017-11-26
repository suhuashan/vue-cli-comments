'use strict'
const utils = require('./utils')
    // 使用一些小工具
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
    // webpack-merge是一个可以合并数组和对象的插件
const baseWebpackConfig = require('./webpack.base.conf')
    //使用webpack的基本配置
const HtmlWebpackPlugin = require('html-webpack-plugin')
    // 使用 html-webpack-plugin 插件，这个插件可以帮我们自动生成 html 并且注入到 .html 文件中
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
    // friendly-errors-webpack-plugin用于更友好地输出webpack的警告、错误等信息
const portfinder = require('portfinder')

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        // 样式文件的处理规则，对css/sass/scss等不同内容使用相应的styleLoaders
        // 由utils配置出各种类型的预处理语言所需要使用的loader，例如sass需要使用sass-loader
        rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    // 使用这种source-map更快
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: process.env.HOST ||  config.dev.host,
        // 如果没有指定运行端口，使用 config.dev.port 作为运行端口
        port: process.env.PORT ||  config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay ? {
            warnings: false,
            errors: true,
        } : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        }
    },
    // webpack插件
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
                // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
        }),
        new webpack.HotModuleReplacementPlugin(),
        // HotModule 插件在页面进行变更的时候只会重回对应的页面模块，不会重绘整个 html 文件
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // 使用了 NoErrorsPlugin 后页面中的报错不会阻塞，但是会在编译结束后报错
        // https://github.com/ampedandwired/html-webpack-plugin
        // 将 index.html 作为入口，注入 html 代码后生成 index.html文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
                // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${config.dev.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors ?
                    utils.createNotifierCallback() : undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})