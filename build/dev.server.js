const PROXY_ENV = process.env.PROXY_ENV || 'dev'
const targets = {
  dev: 'http://127.0.0.1:3000',
  uat: 'http://127.0.0.1:3001',
  prod: 'http://127.0.0.1:3002'
}
console.log(`代理到${PROXY_ENV}环境：${targets[PROXY_ENV]}`)

// https://webpack.js.org/configuration/dev-server/#devserver
module.exports = {
  devServer: {
		open: false, // 是否自动开启
		hot: true, // 开启热更新
    compress: false, // 是否开启压缩
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8088,
    // contentBase: './src',
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/api': {
        target: targets[PROXY_ENV],
        changeOrigin: true // 默认值：false，为true时发送请求头中host会设置成target
      }
    }
	}
}
