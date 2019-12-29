// import './css/base.css'
// import './less/base.less'
// import './scss/base.scss'
// import '@babel/polyfill'

// import Vue from 'vue' // runtime-only的vue包
import Vue from 'vue/dist/vue.js' // 完整版的vuejs
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const homeComponent = {
	template: `<p>Home页面</p>`
}
const errComponent = {
	template: `<p>error页面</p>`
}

const router = new VueRouter({
	mode: 'hash',
	routes: [
		{
			path: '/home',
			component: homeComponent
		},
		{
			path: '/404',
			component: errComponent
		}
	]
})

new Vue({
	el: '#app',
	data: {
		msg: 'hello webpack'
	},
	router
})












