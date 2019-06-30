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
