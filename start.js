const express = require('express')
// https://github.com/chimurai/http-proxy-middleware
const proxy = require('http-proxy-middleware')
const devServerConf = require('./build/dev.server')
const app = express()

// 导入代理设置
for (let key in devServerConf.proxy) {
  app.use(key, proxy(devServerConf[key]))
}

app.use('/', express.static('dist'))

app.get('*', (req, res) => {
  res.redirect('/')
})

app.listen(4002, () => {
  console.log('Server start at: http://localhost:4002/')
})
