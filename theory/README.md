### 准备
1. 新建bin目录，将打包工具主程序放入其中
主程序的顶部当有：#!/usr/bin/env node标识，指定程序的执行环境为node
```javascript
#!/usr/bin/env node

console.log('测试')
```
2.在package.json中配置bin脚本
"bin": {
  "pack": "./bin/pack.js"
}
3.通过npm link链接到全局包中，供本地测试使用

### __webpack_require__函数

- 抽象语法树解析
https://astexplorer.net


### 输出bundle.js过程分析

1. 配置简单的entry和output参数
```javascript
module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	mode: 'development'
}
```

2. 读取index.js文件的内容，通过`@babel/parser`进行语法分析，输出AST(抽象语法树)；
通过`@babel/traverse`遍历操作AST，找到`p.node.callee.name === 'require'`的节点，
修改AST节点属性 `p.node.callee.name = '__webpack_require__'`，
修改路径，并避免windows出现反斜杠：\ `p.node.arguments[0].value`，
通过`@babel/generator`把AST映射回JS代码。

```javascript
  depAnalyse(modulePath) {
		// 读取index.js文件的内容
		let source = this.getSource(modulePath)
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
		// 构建modules对象
		let modulePathRelative = `./${path.relative(this.root, modulePath)}`.replace(/\\+/g, '/')
		this.modules[modulePathRelative] = sourceCode
		// 递归加载所有依赖
		dependencies.forEach(item => {
			this.depAnalyse(path.resolve(this.root, item))
		})
	}
```

3.使用ejs语法编写output.ejs的文件，渲染modules对象并生成类似使用webpack构建输出的bundle.js文件。

```javascript
emitFile() {
		let template = this.getSource(path.join(__dirname, '../template/output.ejs'))
		let reuslt = ejs.render(template, {
			entry: this.entry,
			modules: this.modules
		})
		let output = this.config.output
		let outputPath = path.join(output.path, output.filename)
		fs.writeFileSync(outputPath, reuslt)
	}
```

### loader

加载顺序：pre前置，post后置，遵循：pre > inline > normal > post

```javascript
{test: /\.js$/, use: './loaders/loader.js', enforce: 'pre'}
```