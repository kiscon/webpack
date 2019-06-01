const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
	mode: 'production', // 开发模式配置，默认production
	devtool: 'cheap-module-source-map'
})