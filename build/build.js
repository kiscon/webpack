const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod')

console.log('\x1B[35m%s\x1b[0m', 'building for production...')

webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})

