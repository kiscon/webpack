### webpack的四大核心概念
- entry（入口）
- output（输出）
- loader（用于对模块的源代码进行转换）
- plugins（插件）
  
指令：npx webpack

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

### 第三方库的引入
expose-loader，将库引入到全局作用域
webpack.ProvidePlugin，将库自动加载到每个模块

### HMR使用
需要对某个模块进行热更新时，可以通过module.hot.accept方法进行文件监视
https://segmentfault.com/a/1190000003872635

### 将css提取到独立文件中
mini-css-extract-plugin是用于将css提取为独立的文件的插件，对每个包含css文件，
支持按需加载css和sourceMap，只能在webpack4中，有如下优势：异步加载、不重复编译，性能好、
更容易使用、只针对css。

### 开启css压缩
css-minimizer-webpack-plugin插件来完成css压缩，但由于配置css压缩时会覆盖掉webpack默认
的优化配置，导致js代码无法压缩，所以还需手动把js代码压缩插件导入进来：terser-webpack-plugin

### 抽取公用代码
```
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

### 动态导入(懒加载)
```javascript
import('jquery').then(({default: $}) => {
	console.log($('body'))
})
```
动态导入最大的好处是实现了懒加载，可以提高SPA应用程序的首屏加载速度。


### DllPlugin和DllReferencePlugin
- 主要思想在于：将一些不做修改的依赖文件，提前打包，这样我们开发代码发布的时候
就不需要再对这部分代码进行打包，从而节省了打包时间。
- 使用DllReferencePlugin指定manifest.json文件的位置即可
- 使用add-asset-html-webpack-plugin插件自动添加script标签到HTML中

### 参考配置
https://www.jianshu.com/p/84e0a31024c5

### happypack
早期通过happypack实现多进程打包

### 多进程
- 多进程和多线程介绍
线程是进程的一个执行流，是CPU调度和分派的基本单位，它是比进程更小的能独立运行的基本单位。
**一个进程由几个线程组成**，线程与同属一个进程的其它的线程共享进程所拥有的全部资源。

### Bundle Analysis打包分析
首先配置打包指令：
"build:analyse": "webpack --profile --json > stats.json --config ./build/webpack.prod.js",
在如下链接选择stats.json进行分析
https://webpack.github.io/analyse/

webpack-bundle-analyzer插件，可以进行打包后分析

### 覆盖率
ctrl+shif+p
输入coverage，重新加载网站，查看覆盖率

### [Prefetching/Preloading](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)
- 想提高覆盖率，需要尽可能多的使用动态导入，也就是懒加载
- 在懒加载时使用魔法注释：Prefetching，是指在首页资源加载完毕后，空闲时间时，
将动态导入的资源加载进来，这样既可以提高首屏加载速度，也可以解决懒加载可能会影响用户体验问题。

### webpack性能优化
```
  自带优化
  html优化
    压缩：html-webpack-plugin
  css优化
    提取到单独文件：mini-css-extract-plugin
    自动添加前缀
    压缩：css-minimizer-webpack-plugin
  js优化
    代码分离：手动配置多入口，抽取公用代码、懒加载、SplitChunksPlugin参数详解
    noParse：当使用的第三方库过大，并且不包含import require define 的调用。可以使用noParse让库不被loaders 解析
    DllPlugin：将固定库抽取成动态链接库节省资源
    依赖库分离：optimization.splitChunks
    压缩：terser-webpack-plugin
  多进程打包
    happypack
  合并压缩图片
    base64转换：file-loader 和url-loader 两个loaders供选择
    压缩图片：image-webpack-loader
  浏览器缓存
  打包分析
    依赖分析：webpack-bundle-analyzer
  删除冗余代码
    Tree shaking
    // .babelrc
    {
      "presets": [["env", { "modules": false }]]
    }
  Prefetching
  微任务、宏任务
  ```

git remote set-url origin git@github.com:kiscon/webpack.git