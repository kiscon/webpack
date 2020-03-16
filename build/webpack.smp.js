const prodConfig = require('./webpack.prod')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()

// 打包速度分析，查看每个loader和插件执行耗时
module.exports = smp.wrap(prodConfig)
