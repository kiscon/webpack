// 首页
const homePage = () => import(/* webpackChunkName: "xsHomePage" */ '@/test/pages/home-page/index.vue')

export default [
  {
    path: '/home-page/index',
    component: homePage,
    meta: { title: '首页', keepAlive: true }
  }
]
