const path = require('path')
const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

class Compiler {
	constructor(config) {
		this.config = config
		this.entry = config.entry
		this.root = process.cwd()
	}
	getSource(path) {
		return fs.readFileSync(path, 'utf-8')
	}
	depAnalyse(modulePath) {
		// 读取index.js文件的内容
		let source = this.getSource(modulePath)
		let ast = parser.parse(source)
		// console.log(ast)
		traverse(ast, {
			CallExpression(p) {
				if (p.node.callee.name === 'require') {
					p.node.callee.name = '__webpack_require__'
				}
			}
		})
		let sourceCode = generator(ast).code
		console.log(sourceCode)
	}
	start() {
		this.depAnalyse(path.resolve(this.root, this.entry))
	}
}

module.exports = Compiler