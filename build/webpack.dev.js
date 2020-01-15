const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const baseConfig = require('./webpack.base')
const pkg = require('../package.json')

const PROXY_ENV = process.env.PROXY_ENV || 'dev'
const targets = {
  dev: 'http://127.0.0.1:3000',
  uat: 'http://127.0.0.1:3001',
  prod: 'http://127.0.0.1:3002'
}
// console.log(`代理到${PROXY_ENV}环境：${targets[PROXY_ENV]}`)

const devWebpackConfig = merge(baseConfig, {
  mode: 'development', // 开发模式配置，默认production
  stats: 'errors-only', // errors-only：只在发生错误时输出【该配置可处理webpack服务启动时，去掉多余的打印信息】
	devtool: 'cheap-module-eval-source-map',
	// watch: true, // 开启监视模式，此时webpack指令进行打包会监视文件变化自动打包
	devServer: {
		open: false, // 是否自动开启
		hot: true, // 开启热更新
    compress: false, // 是否开启压缩
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8088,
    // contentBase: './src',
    proxy: {
      '/api': {
        target: targets[PROXY_ENV],
        changeOrigin: true
      }
    },
	},
	plugins: [
		// DefinePlugin会解析定义的环境变量表达式，当成JS执行
		new webpack.DefinePlugin({
			IS_DEV: 'true'
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: 'index.html',
      template: './src/test/public/index.html',
      inject: true
		})
	]
})

module.exports = new Promise((resolve, reject) => {
  // portfinder：获取当前可用的port (一旦端口被占用，报错，再次运行时会打开：8080+1,依次类推...8080+n)
  portfinder.basePort = process.env.PORT || devWebpackConfig.devServer.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      // 添加端口到devServer配置
      devWebpackConfig.devServer.port = port
      // https://github.com/geowarin/friendly-errors-webpack-plugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: (severity, errors) => {
          if (severity !== 'error') return
          const error = errors[0]
          const filename = error.file && error.file.split('!').pop()
          alert(JSON.stringify({
            title: pkg.name,
            message: severity + ': ' + error.name,
            subtitle: filename || ''
          }))
        }
      }))
      resolve(devWebpackConfig)
    }
  })
})