const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const PROXY_ENV = process.env.PROXY_ENV || 'dev'
const targets = {
  dev: 'http://127.0.0.1:3000',
  uat: 'http://127.0.0.1:3001',
  prod: 'http://127.0.0.1:3002'
}
// console.log(`代理到${PROXY_ENV}环境：${targets[PROXY_ENV]}`)

module.exports = merge(baseConfig, {
	mode: 'development', // 开发模式配置，默认production
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
		})
	]
})