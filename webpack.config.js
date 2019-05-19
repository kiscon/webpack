const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		// path.resolve：解析当前相对路径的绝对路径
		path: path.resolve(__dirname, 'dist'),
		filename: 'my-first-webpack.bundle.js'
	},
	mode: 'development', // 开发模式配置，默认production
}