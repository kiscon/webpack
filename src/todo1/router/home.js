// 首页
const homePage = () => import(/* webpackChunkName: "xsHomePage" */ '../pages/home-page/index.vue')

export default [
  {
    path: '/',
    redirect: '/home-page/index'
  },
  {
    path: '/home-page/index',
    component: homePage,
    meta: { title: '首页', keepAlive: true }
  }
]
