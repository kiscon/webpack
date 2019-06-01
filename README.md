npx webpack

### html-webpack-plugin
1. 根据模板在express项目根目录下生成html文件（类似于devServer生成内存中的bundle.js）
2. 自动引入bundle.js
3. 打包时会自动生成index.html

### webpack-dev-middleware
注：如果使用middleware，必须使用html-webpack-plugin插件，否则html文件无法正确输出到express服务器的根目录

### 样式文件处理
- style-loader
- css-loader
- less-loader
- less
- sass-loader
- node-sass

webpack读取loader时是从右到左的读取，会将css文件先交给最右侧的loader来处理
loader的执行顺序是管道的方式链式调用

css-loader：解析css文件
style-loader：将解析出来的结果，放到html中，使其生效

### 处理图片和字体

url-loader封装了file-loader，所以使用url-loader时需要安装file-loader

### js文件转换
@babel/preset-env
@babel/plugin-proposal-class-properties

处理generator  
@babel/plugin-transform-runtime
@babel/runtime

### BannerPlugin
webpack的内置插件，用于给打包的js文件加上版权注释信息



### 参考配置
https://www.jianshu.com/p/84e0a31024c5