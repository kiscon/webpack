// const loaderUtils = require('loader-utils')

module.exports = function (source) {
  // console.log('loader')
  // let options = loaderUtils.getOptions(this)
  // console.log(options)
  console.log(this.query)
  return source.replace(/测试/g, 'options.name')
}