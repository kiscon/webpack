const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
	mode: 'development', // 开发模式配置，默认production
	devtool: 'cheap-module-eval-source-map',
	// watch: true, // 开启监视模式，此时webpack指令进行打包会监视文件变化自动打包
	devServer: {
		open: true, // 自动开启
		hot: true, // 开启热更新
		port: 5000,
		compress: true, //开启压缩
		// contentBase: './src'
	},
	plugins: [
		// DefinePlugin会解析定义的环境变量表达式，当成JS执行
		new webpack.DefinePlugin({
			IS_DEV: 'true'
		})
	]
})