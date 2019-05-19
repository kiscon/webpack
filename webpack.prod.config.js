const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		// path.resolve：解析当前相对路径的绝对路径
		path: path.resolve(__dirname, 'dist'),
		filename: 'prod.bundle.js'
	},
	mode: 'production', // 开发模式配置，默认production
}