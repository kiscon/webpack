const path = require('path')
const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const ejs = require('ejs')

class Compiler {
	constructor(config) {
		this.config = config
		this.entry = config.entry
		this.root = process.cwd()
		this.modules = {}
	}
	getSource(path) {
		return fs.readFileSync(path, 'utf-8')
	}
	depAnalyse(modulePath) {
		// 读取index.js文件的内容
		let source = this.getSource(modulePath)
		let ast = parser.parse(source)
		// 存储当前模块的所有依赖
		let dependencies = []

		// console.log(ast)
		traverse(ast, {
			CallExpression(p) {
				if (p.node.callee.name === 'require') {
					// 修改require
					p.node.callee.name = '__webpack_require__'
					// 修改路径，并避免windows出现反斜杠：\
					let oldVal = p.node.arguments[0].value
					oldVal = `./${path.join('src', oldVal)}`
					p.node.arguments[0].value = oldVal.replace(/\\+/g, '/')

					dependencies.push(p.node.arguments[0].value)
				}
			}
		})
		
		// 解析新的ast
		let sourceCode = generator(ast).code
		// console.log(sourceCode)

		// 构建modules对象
		let modulePathRelative = `./${path.relative(this.root, modulePath)}`.replace(/\\+/g, '/')
		this.modules[modulePathRelative] = sourceCode

		// 递归加载所有依赖
		dependencies.forEach(item => {
			this.depAnalyse(path.resolve(this.root, item))
		})
	}
	emitFile() {
		let template = this.getSource(path.join(__dirname, '../template/output.ejs'))
		let reuslt = ejs.render(template, {
			entry: this.entry,
			modules: this.modules
		})
		// console.log(reuslt)
		let output = this.config.output
		let outputPath = path.join(output.path, output.filename)
		console.log(outputPath)
		fs.writeFileSync(outputPath, reuslt)
	}
	start() {
		this.depAnalyse(path.resolve(this.root, this.entry))
		this.emitFile()
		// console.log(this.modules)
	}
}

module.exports = Compiler