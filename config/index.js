'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    // 开发过程中使用的配置
    dev: {

        // Paths
        // 静态资源文件夹
        assetsSubDirectory: 'static',
        // 发布路径
        assetsPublicPath: '/',
        // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名
        proxyTable: {},
        // 需要 proxyTable 代理的接口（可跨域）
        // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
        // 例如将'localhost:8080/api/xxx'代理到'www.example.com/api/xxx'
        // Various Dev Server settings
        host: 'localhost', // can be overwritten by process.env.HOST
        //运行页面时的本地服务器域名
        port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
        //运行测试页面的端口
        autoOpenBrowser: false,
        // 是否自动打开浏览器
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: true,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'eval-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
    },
    // 构建产品中使用的配置
    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),
        // 编译输入的 index.html 文件
        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        // 编译输出的静态资源根路径
        assetsSubDirectory: 'static',
        // 编译输出的二级目录
        assetsPublicPath: '/',
        // 编译发布上线路径的根目录，可配置为资源服务器域名或 CDN 域名

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',
        // 是否开启 cssSourceMap

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        // 是否开启gzip压缩
        productionGzipExtensions: ['js', 'css'],
        // gzip模式下需要压缩的文件的扩展名，设置js、css之后就只会对js和css文件进行压缩
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        // 是否展示webpack构建打包之后的分析报告
        bundleAnalyzerReport: process.env.npm_config_report
    }
}