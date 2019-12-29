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
			chunks: 'all', // 默认 async 表示只会对异步加载的模块进行代码切割，可选值还有all | initial
			minSize: 30000, // 最少大于30kB才拆分
			minChunks: 1, // 模块最少引用一次才会被拆分
			maxAsyncRequests: 5, // 异步加载时同时发送的请求数量最大不能超过5，超过5的部分不拆分
			maxInitialRequests: 3, // 页面初始化同时发送请求数量最大不超过3
			automaticNameDelimiter: '-', // 默认的连接符 ~
			name: true, // 拆分的chunk名，设为true表示根据模块名和cacheGroups的key来自动生成，使用上面连接符连接
			cacheGroups: { // 缓存组配置
				vendors: { // 自定义缓存组名
					test: /[\\/]node_modules[\\/]/,
					priority: -10 // 权重-10，决定了哪个组优先匹配，例如node_modules下有个模块要拆分，同时满足vendors和default组，
					// 此时就会分到vendors组，因为-10>-20
				},
				default: { // 默认缓存组名
					minChunks: 2, // 最少引用两次才会被拆分
					priority: -20, // 权重-20
					reuseExistingChunk: true, // 如果主入口中引入了两个模块，其中一个正好也引用了后一个，就会直接复用，无需引用两次
				}
			}
		}
	}
})