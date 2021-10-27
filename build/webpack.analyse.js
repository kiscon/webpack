const { merge } = require('webpack-merge')
const prodConfig = require('./webpack.prod')
// 打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(prodConfig, {
	plugins: [
		new BundleAnalyzerPlugin()
	]
})