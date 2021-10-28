const path = require('path')
const devConf = require('../build/dev.server')
const { exec } = require('child_process')

// 开启服务
const startService = () => {
  const Koa = require('koa')
  const Router = require('koa-router')
  const Static = require('koa-static')
  const proxy = require('koa-server-http-proxy') // https://github.com/eugeneCN/koa-server-http-proxy
  const app = new Koa()
  const router = new Router()

  // 导入代理设置
  Object.keys(devConf.devServer.proxy).forEach(key => {
    app.use(proxy(key, devConf.devServer.proxy[key]))
  })

  app.use(Static(path.join(__dirname, '..', 'dist')))

  router.get('*', async (ctx, next) => {
    ctx.redirect('/')
  })

  app.use(router.routes()).use(router.allowedMethods())

  app.listen(4002, () => {
    console.log('Server start at: http://localhost:4002/')
  })
}

exec('yarn', {
  cwd: __dirname
}, (err, stdout, stderr) => {
  if (err) {
    return console.error(err)
  }
  if (stdout) {
    console.log('\x1B[32m%s\x1b[0m', stdout.toString())
    startService()
  }
  if (stderr) {
    console.log(`stderr:${stderr}`)
  }
})
