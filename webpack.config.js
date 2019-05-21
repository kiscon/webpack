const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	entry: './src/index.js',
	output: {
		// path.resolve：解析当前相对路径的绝对路径
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	mode: 'development', // 开发模式配置，默认production
	watch: true, // 开启监视模式，此时webpack指令进行打包会监视文件变化自动打包
	devServer: {
		open: true, // 自动开启
		hot: true,
		port: 5000,
		compress: true, //开启压缩
		// contentBase: './src'
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html'
		})
	]
}