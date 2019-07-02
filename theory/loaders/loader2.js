module.exports = function (source) {
  // console.log(source)
  return source.replace(/'测试'/g, 'loader2')
}