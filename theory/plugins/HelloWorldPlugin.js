// 编写插件：https://webpack.js.org/contribute/writing-a-plugin/

class HelloWorldPlugin {
  apply(compiler) {
    // 通过compiler对象可以注册对应的事件
    // tap：同步钩子，tapAsync：异步钩子

    // 编译器完成后调用
    compiler.hooks.done.tap('HelloWorldPlugin', stats => {
      console.log('打包结束了')
    })
    // 向assets目录发射assets时调用
    compiler.hooks.emit.tap('HelloWorldPlugin', compilation => {
      console.log('文件发射结束了')
    })
  }
}

module.exports = HelloWorldPlugin