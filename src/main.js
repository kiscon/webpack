import './css/base.css'
import './less/base.less'
import './scss/base.scss'
import '@babel/polyfill'
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

