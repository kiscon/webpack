const path = require('path')
const devConf = require('../build/dev.server')
const { spawn } = require('child_process')

// 开启服务
const startService = (express, proxy) => {
  const app = express()
  // 导入代理设置
  Object.keys(devConf.devServer.proxy).forEach(key => {
    app.use(proxy(key, devConf.devServer.proxy[key]))
  })

  app.use('/', express.static(path.join(__dirname, '..', 'dist')))

  app.get('*', (req, res) => {
    res.redirect('/')
  })

  app.listen(4002, () => {
    console.log('Server start at: http://localhost:4002/')
  })
}

try {
  const express = require('express')
  // https://github.com/chimurai/http-proxy-middleware
  const proxy = require('http-proxy-middleware')
  startService(express, proxy)
} catch {
  /**
   * 开启子进程安装依赖包
   * http://nodejs.cn/api/child_process.html
   * 使用npm的时候spawn('npm', ['install'], {})
   * **/
  const _yarn = spawn('yarn', {
    cwd: __dirname
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
    startService(require('express'), require('http-proxy-middleware'))
  })
}
