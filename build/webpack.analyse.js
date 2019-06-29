const merge = require('webpack-merge')
const prodConfig = require('./webpack.prod')
const baseConfig = require('./webpack.base')
// 打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(baseConfig, prodConfig, {
	plugins: [
		new BundleAnalyzerPlugin()
	]
})