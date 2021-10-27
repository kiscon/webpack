const path = require('path')
const devConf = require('../build/dev.server')
const { spawn } = require('child_process')

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

try {
  const koa = require('koa')
  startService(koa)
} catch {
  /**
   * 开启子进程安装依赖包
   * http://nodejs.cn/api/child_process.html
   * 使用npm的时候spawn('npm', ['install'], {})
   * **/
  const _yarn = spawn('yarn', {
    cwd: './start'
  })
  // stdout 获取标准输出
  _yarn.stdout.on('data', data => {
    console.log(`stdout: ${data}`)
  })
  // stderr 获取标准错误输出
  _yarn.stderr.on('data', data => {
    console.error(`stderr: ${data}`)
  })
  _yarn.on('close', code => {
    console.log(`子进程退出，退出码: ${code}`)
    startService()
  })
}
