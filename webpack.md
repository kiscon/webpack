### 1.webpack：tree-shaking

```
Tree-shaking是指在打包中去除那些引入了，但是在代码中没有被用到的那些冗余代码。
在webpack中Tree-shaking是通过terser-webpack-plugin来Tree-shaking JS。css需要使用Purify-CSS
terser-webpack-plugin：用来对js文件进行压缩，从而减小js文件的大小，加速load速度。
用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题
```

### 2.什么是bundle，什么是chunk，什么是module

  bundle是由webpack打包出来的文件，chunk是指webpack在进行模块的依赖分析的时候，代码分割出来的代码块。module是开发中的单个模块。

### 3.什么是模块热更新、HMR原理是什么

  模块热更新是webpack的一个功能，它可以使得代码修改过后不用刷新浏览器就可以更新，是高级版的自动刷新浏览器。

**原理：**

- 使用`express`启动本地服务，当浏览器访问资源时对此做响应。
- 服务端和客户端使用`websocket`实现长连接
- `webpack`监听源文件的变化，即当开发者保存文件时触发`webpack`的重新编译。
  - 每次编译都会生成`hash值`、`已改动模块的json文件`、`已改动模块代码的js文件`
  - 编译完成后通过`socket`向客户端推送当前编译的`hash戳`
- 客户端的`websocket`监听到有文件改动推送过来的`hash戳`，会和上一次对比
  - 一致则走缓存
  - 不一致则通过`ajax`和`jsonp`向服务端获取最新资源
- 使用`内存文件系统`去替换有修改的内容实现局部刷新

### 4.webpack打包原理及流程

原理： 把所有依赖打包成一个bundle.js文件，通过代码分割成单元片段并按需加载。

构建流程主要分成7个步骤：读取入口文件、分析模块引用、按照引用加载模块、模块文件编译处理、模块文件合并、文件优化处理、写入生成目录。

### 5.什么是长缓存？在webpack中如何做到长缓存优化？

```
	浏览器在用户访问页面的时候，为了加快加载速度，会对用户访问的静态资源进行存储，但是每一次代码升级或者更新，都需要浏览器去下载新的代码，最方便和最简单的更新方式就是引入新的文件名称。
	在webpack中，可以在output给出输出的文件制定chunkhash，并且分离经常更新的代码和框架代码，通过NameModulesPlugin或者HashedModulesPlugin使再次打包文件名不变。
```

### 6.webpack如何将css文件打包的

```
css文件的打包需要用到css-loader和style-loader两个loader
  css-loader：只是用于加载css文件（并没有添加到页面）。
  style-loader：则是将打包后的css代码以<style>标签形式添加到页面头部。
  module: {
    rules: [  
      {
        test: /\.css$/,   // 正则表达式，表示.css后缀的文件
        use: ['style-loader', 'css-loader']   // 针对css文件使用的loader，注意有先后顺序，数组项越靠后越先执行
      }
    ]
  }
```

### 7.happyPack开启多线程loader转换

  happypack可以将任务分解给多个子进程，最后将结果发给主进程，js是单线程模型，通过这种多线程的方式提高性能。

```javascript
// 在module的rules中
{
  test: /\.js$/,
  use: [
    isProduction ? 'happypack/loader?id=happyBabel' : 'babel-loader'
  ],
  exclude: '/node_modules/',
  include: path.resolve('../src')
}

// 在plugins中
// https://github.com/amireh/happypack
new HappyPack({
  id: 'happyBabel', // loader?后面指定的id
  loaders: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true // 利用缓存，提高性能
    }
  }],
  threadPool: HappyPack.ThreadPool({ size: 4 }), // 代表共享进程池，（查看电脑cpu核数，require('os').cpus().length）
  verbose: true, // 是否允许 HappyPack 输出日志，默认是 true
}),
```

### 8.DllPlugin

```
 使用DllPlugin可以减少基础模块编译次数，动态链接库插件。
  其原理是：把依赖的基础模块抽离出来打包到dll文件中，当需要导入的模块存在于某个dll中时，这个模块不再被打包，而是去dll中获取。
  在dll中大多包含的是常用的第三方模块，只要这些模块版本不升级，就只需要被编译一次。
  注意：DllPlugin参数中的name必须要和output.library值保持一致，并且生成的mainfest文件中会引用output.library值
```

### 9.对webpack做了哪些优化

```
自带优化
  html优化
    压缩：html-webpack-plugin
  css优化
    提取到单独文件：mini-css-extract-plugin
    自动添加前缀
    压缩：optimize-css-assets-webpack-plugin
  js优化
    代码分离：手动配置多入口，抽取公用代码、懒加载、SplitChunksPlugin参数详解
    noParse：当使用的第三方库过大，并且不包含import require define 的调用。可以使用noParse让库不被loaders 解析
    lgnorePlugin：不打包moment的语言包，new webpack.IgnorePlugin(/\.\/locale/, /moment/)
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

### 10.loader原理

 loader 是模块和资源的转换器，它本质是一个函数，接受源文件以字符串的形式读入，对其进行语法分析及转换，然后将结果交由下一环节进行处理。

loader执行顺序是从右往左执行的。至于为什么是从右到左执行而不是从左到右？因为webpack是用compose式编程，而从左到右则是pipe式编程。

### 11.外部扩展externals配置

配置externals[ɪkˈstɜːrnlz]选项提供了「从输出的 bundle 中排除依赖」的方法。
https://webpack.docschina.org/configuration/externals/

vue.config.js

```javascript
const externals = ['vue', 'vuex', 'vue-router', 'vant']
const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
	configureWebpack: {
    externals: isProduction ? externals : []
  },
}
```

webpack.config.js

```javascript
module.exports = {
  ...
  output: {
    ...
  },
  externals : {
    vue: 'vue',
    vuex: 'vuex'
  }
  ...
}
```

index.html

```html
<script src="https://cdn.bootcss.com/vue/2.6.10/vue.runtime.min.js"></script>
```

