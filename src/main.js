import './css/base.css'
import './less/base.less'
import './scss/base.scss'
import '@babel/polyfill'
// 注意：要先导入这模块，否则module.hot.accept('./pages/HMR/hot-module', fn) 回调函数里没反应
import str from './pages/HMR/hot-module'
import moment from 'moment'
// 手动引入语言包
import 'moment/locale/zh-cn'
// 设置语言
moment.locale('zh-CN')

console.log(moment().subtract(6, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'))
console.log(moment().subtract(6, 'days').calendar())
// 静态导入
// import $ from 'jquery'
// console.log($('body'))

// 动态导入
import('jquery').then(({default: $}) => {
	console.log($('body'))
})

console.log(str)

class Person {
	constructor(name) {
		this.name = name
	}
}
let p = new Person()

if (!IS_DEV) {
	console.log('生产环境')
} else {
	console.log('开发环境')
}

// 热更新
if (module.hot) {
	module.hot.accept('./pages/HMR/hot-module', function () {
		console.log('hotmodule更新了')
		const hotModule = require('./pages/HMR/hot-module').default
		console.log(hotModule)
	})
}
