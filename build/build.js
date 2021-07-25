const webpack = require('webpack')
const path = require('path')
const { existsSync } = require('fs')
const { exec } = require('child_process')

if (!existsSync('dll')) {
  exec('webpack --config build/webpack.dll.js', {}, function (err, stdout, stderr) {
    if (err) {
      return console.error(err)
    }
    if (stdout) {
      console.log('\x1B[32m%s\x1b[0m', stdout.toString())
      build()
    }
    if (stderr) {
      console.log(data.toString())
    }
  })
} else {
  build()
}

// 构建
function build() {
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
}



