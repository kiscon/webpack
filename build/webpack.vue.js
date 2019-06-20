/*
* 配置打包vue全家桶
* */
const path = require('path')
const webpack = require('webpack')

module.exports = {
	mode: 'production',  // 开发模式配置，默认production || development
	entry: {
		vue: [
			'vue/dist/vue.js',
			'vue-router'
		]
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name]_dll.js',
		library: '[name]_dll' // 最终会在全局暴露出一个vue_dll的对象
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]_dll',
			path: path.resolve(__dirname, '../dist/manifest.json'),
		})
	]
}