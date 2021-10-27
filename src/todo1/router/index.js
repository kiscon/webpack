import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

const getRoutes = (context, ignore) => {
  const routes = []
  context.keys().forEach(key => {
    if (key !== ignore) {
      const data = context(key).default
      if (data && data.length) {
        routes.push(...data)
      }
    }
  })
  return routes
}

/**
* require.context函数
* @param directory {String} -读取文件的路径
* @param useSubdirectories {Boolean} -是否遍历文件的子目录
* @param regExp {RegExp} -匹配文件的正则
**/
const routes = getRoutes(require.context('./', false, /\.js$/), './index.js')
console.log(routes)

/**
* vue-router的hash模式跟history模式的区别
Hash即地址栏的url中的#符号，hash虽然出现在URL中，但不会被包括在HTTP请求；history：
利用了HTML5 History Interface 中新增的pushState() 和replaceState() 方法。
History模式下，如果刷新可能会出现资源404，当你刷新了之后浏览器就耿直的去请求服务器了，然而服务器没有这个路由，于是就404了。
解决方法1: 可以做个代理，让所有访问服务器的地址都返回同一个入口文件。（推荐使用）
解决方法2: 因为只需要在后台配置如果URL匹配不到任何静态资源，就跳转到默认的index.html
**/
const router = new VueRouter({
  mode: 'hash',
  routes: routes
})

export default router
