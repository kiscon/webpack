/*
 * 配置打包dll
 */
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',  // 开发模式配置，默认production || development
  stats: {
    modules: false, // 默认true，是否添加构建模块信息
  },
	entry: {
		xlib: ['vue/dist/vue.runtime.esm.js', 'vue-router', 'lodash']
	},
	output: {
		path: path.resolve(__dirname, '../dll'),
		filename: '[name].dll.[chunkhash].js',
		library: '[name]' // 最终会在全局暴露出一个[name].dll.[chunkhash]的对象
	},
	plugins: [
		new webpack.DllPlugin({
			name: '[name]',
			path: path.resolve(__dirname, '../dll/[name]-manifest.json'),
    })
	]
}