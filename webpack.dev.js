const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
	mode: 'development', // 开发模式配置，默认production
	// watch: true, // 开启监视模式，此时webpack指令进行打包会监视文件变化自动打包
	devServer: {
		open: true, // 自动开启
		hot: true,
		port: 5000,
		compress: true, //开启压缩
		// contentBase: './src'
	},
	devtool: 'cheap-module-eval-source-map'
})