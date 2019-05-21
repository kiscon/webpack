npx webpack

### html-webpack-plugin
1. 根据模板在express项目根目录下生成html文件（类似于devServer生成内存中的bundle.js）
2. 自动引入bundle.js
3. 打包时会自动生成index.html

### webpack-dev-middleware
注：如果使用middleware，必须使用html-webpack-plugin插件，否则html文件无法正确输出到express服务器的根目录