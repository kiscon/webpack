// import './common/css/base.css'
// import './less/base.less'
// import './common/scss/base.scss'
// import '@babel/polyfill'

import Vue from 'vue' // runtime-only的vue包
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')













