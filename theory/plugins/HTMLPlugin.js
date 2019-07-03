const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

class HTMLPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.afterEmit.tap('HTMLPlugin', compilation => {
      console.log(this.options)
      let result = fs.readFileSync(this.options.template, 'utf-8')
      let $ = cheerio.load(result)
      Object.keys(compilation.assets).forEach(item => {
        $(`<script src="/${item}"></script>`).appendTo('body')
      })
      let filePath = path.join(process.cwd(), 'dist', this.options.filename)
      console.log(filePath)
      fs.writeFileSync(filePath, $.html())
    })
    // compiler.hooks.done.tap('HTMLPlugin', stats => {
    //   // stats有四个属性：compilation hash startTime endTime
    //   // console.log(...Object.keys(stats))
    //   // 如果使用done钩子，则需要使用stats.compilation.assets获取数据
    // })
  }
}

module.exports = HTMLPlugin