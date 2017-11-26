'use strict'
const path = require('path')
    //使用nodejs自带的文件路径插件
const utils = require('./utils')
    // 使用一些小工具
const webpack = require('webpack')
const config = require('../config')
    // 加载 config/index.js
const merge = require('webpack-merge')
    // 加载 webpack 配置合并工具
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
    // copy-webpack-plugin，用于将static中的静态文件复制到产品文件夹dist
const HtmlWebpackPlugin = require('html-webpack-plugin')
    // 一个可以插入 html 并且创建新的 .html 文件的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin')
    // optimize-css-assets-webpack-plugin，用于优化和最小化css资源
    // 一个 webpack 扩展，可以提取一些代码并且将它们和文件分离开
    // 如果我们想将 webpack 打包成一个文件 css js 分离开，那我们需要这个插件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const env = require('../config/prod.env')
    // 合并 webpack.base.conf.js
const webpackConfig = merge(baseWebpackConfig, {
        module: {
            // 使用的 loader
            rules: utils.styleLoaders({
                sourceMap: config.build.productionSourceMap,
                extract: true,
                usePostCSS: true
            })
        },
        // 是否使用source-map
        devtool: config.build.productionSourceMap ? config.build.devtool : false,
        // webpack输出路径和命名规则
        output: {
            path: config.build.assetsRoot,
            // 编译输出文件名
            // 我们可以在 hash 后加 :6 决定使用几位 hash 值
            filename: utils.assetsPath('js/[name].[chunkhash].js'),
            // 没有指定输出名的文件输出的文件名
            chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
        },
        plugins: [
            // 使用的插件
            // http://vuejs.github.io/vue-loader/en/workflow/production.html
            // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
            new webpack.DefinePlugin({
                'process.env': env
            }),
            // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
            // 压缩 js (同样可以压缩 css)
            // 丑化压缩JS代码
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                sourceMap: config.build.productionSourceMap,
                parallel: true
            }),
            // extract css into its own file
            new ExtractTextPlugin({
                // 将 css 文件分离出来
                filename: utils.assetsPath('css/[name].[contenthash].css'),
                // set the following option to `true` if you want to extract CSS from
                // codesplit chunks into this main css file as well.
                // This will result in *all* of your app's CSS being loaded upfront.
                allChunks: false,
            }),
            // Compress extracted CSS. We are using this plugin so that possible
            // duplicated CSS from different components can be deduped.
            // 优化、最小化css代码，如果只简单使用extract-text-plugin可能会造成css重复
            // 具体原因可以看npm上面optimize-css-assets-webpack-plugin的介绍
            new OptimizeCSSPlugin({
                cssProcessorOptions: config.build.productionSourceMap ? { safe: true, map: { inline: false } } : { safe: true }
            }),
            // generate dist index.html with correct asset hash for caching.
            // you can customize output by editing /index.html
            // see https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                // 输入输出的 .html 文件
                filename: config.build.index,
                template: 'index.html',
                // 是否注入 html
                inject: true,
                // 压缩的方式
                minify: {
                    // 删除index.html中的注释
                    removeComments: true,
                    // 删除index.html中的空格
                    collapseWhitespace: true,
                    // 删除各种html标签属性值的双引号
                    removeAttributeQuotes: true
                        // more options:
                        // https://github.com/kangax/html-minifier#options-quick-reference
                },
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency'
                    // 注入依赖的时候按照依赖先后顺序进行注入，比如，需要先注入vendor.js，再注入app.js
            }),
            // keep module.id stable when vender modules does not change
            new webpack.HashedModuleIdsPlugin(),

            // enable scope hoisting
            new webpack.optimize.ModuleConcatenationPlugin(),
            // split vendor js into its own file
            // 将所有从node_modules中引入的js提取到vendor.js，即抽取库文件
            new webpack.optimize.CommonsChunkPlugin({
                // 没有指定输出文件名的文件输出的静态文件名
                name: 'vendor',
                minChunks: function(module) {
                    // any required modules inside node_modules are extracted to vendor
                    return (
                        module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.indexOf(
                            path.join(__dirname, '../node_modules')
                        ) === 0
                    )
                }
            }),
            // extract webpack runtime and module manifest to its own file in order to
            // prevent vendor hash from being updated whenever app bundle is updated
            // 从vendor中提取出manifest，原因如上
            new webpack.optimize.CommonsChunkPlugin({
                // 没有指定输出文件名的文件输出的静态文件名
                name: 'manifest',
                minChunks: Infinity
            }),
            // This instance extracts shared chunks from code splitted chunks and bundles them
            // in a separate chunk, similar to the vendor chunk
            // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
            new webpack.optimize.CommonsChunkPlugin({
                // 没有指定输出文件名的文件输出的静态文件名
                name: 'app',
                async: 'vendor-async',
                children: true,
                minChunks: 3
            }),

            // copy custom static assets
            // 将static文件夹里面的静态资源复制到dist/static
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }])
        ]
    })
    // 开启 gzip 的情况下使用下方的配置
if (config.build.productionGzip) {
    // 加载 compression-webpack-plugin 插件
    const CompressionWebpackPlugin = require('compression-webpack-plugin')
        // 向webpackconfig.plugins中加入下方的插件
    webpackConfig.plugins.push(
        // 使用 compression-webpack-plugin 插件进行压缩
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}
// 如果启动了report，则通过插件给出webpack构建打包后的产品文件分析报告
if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig