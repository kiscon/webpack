const webpack = require('webpack')
const merge = require('webpack-merge')
// css压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// js压缩
const TerserJSPlugin = require('terser-webpack-plugin')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
	mode: 'production', // 开发模式配置，默认production
	devtool: 'cheap-module-source-map',
	plugins: [
		new webpack.DefinePlugin({
			IS_DEV: 'false'
		})
	],
	optimization: {
		minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})], // 代码压缩
		splitChunks: { // 抽取公用代码
			chunks: 'all'
		}
	}
})