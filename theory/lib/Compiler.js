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
		// 初始化一个空对象，存放所有的模块
		this.modules = {}
		// 将module.rules挂载到自身
		this.rules = config.module.rules

	}
	getSource(path) {
		return fs.readFileSync(path, 'utf-8')
	}
	depAnalyse(modulePath) {
		// 读取index.js文件的内容
		let source = this.getSource(modulePath)
		// 解析rules规则
		source = this.handleModule(modulePath, source)
		// 进行语法分析，输出AST
		let ast = parser.parse(source)
		// 存储当前模块的所有依赖
		let dependencies = []

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
		// 使用模板进行拼接字符串，生成最终的结果代码
		let template = this.getSource(path.join(__dirname, '../template/output.ejs'))
		let reuslt = ejs.render(template, {
			entry: this.entry,
			modules: this.modules
		})
		// 获取输出目录
		let output = this.config.output
		let outputPath = path.join(output.path, output.filename)
		// 写入生成文件
		fs.writeFileSync(outputPath, reuslt)
	}
	start() {
		this.depAnalyse(path.resolve(this.root, this.entry))
		this.emitFile()
		// console.log(this.modules)
	}
	handleModule(modulePath, source) {
		// 读取rules规则，倒序遍历
		let rules = this.config.module.rules
		let len = rules.length - 1
		const handleLoader = (use, obj) => {
			let loaderPath = path.join(this.root, use)
			let loader = require(loaderPath)
			return loader.call(obj, source)
		}
		for (let i = len; i >= 0; i--) {
			const {use, test} = rules[i]
			// 获取每条规则，与当前modulePath进行匹配
			if (test.test(modulePath)) {
				if (Array.isArray(use)) {
					for (let j = use.length - 1; j >= 0; j--) {
						source = handleLoader(use[j])
					}
				}
				else if (typeof use === 'string') {
					source = handleLoader(use)
				}
				else if (use instanceof Object) {
					source = handleLoader(use.loader, { query: use.options })
				}
			}
		}
		// console.log(source)
		return source
	}
}

module.exports = Compiler