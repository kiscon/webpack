## webpack4+升级到webpack5+的变化

1. `css-minimizer-webpack-plugin`替换`optimize-css-assets-webpack-plugin`

[ For webpack v5 or above please use css-minimizer-webpack-plugin instead.](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)

2. `webpack-merge` 引入方式

```js
// 4.+
const merge = require('webpack-merge')
// 5.+
const { merge } = require('webpack-merge')
```

3. [devServer](https://webpack.js.org/configuration/dev-server/#devserver)的overlay调整在client参数下

```js
// 4.+
module.exports = {
  devServer: {
    overlay: {
      errors: true,
      warnings: false
    }
  }
}
// 5.+
module.exports = {
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  }
}
```

4. [devtool](https://webpack.js.org/configuration/devtool/)

```js
// 4.+
module.exports = {
  devtool: 'cheap-eval-source-map',
}
// 5.+
module.exports = {
  devtool: 'eval-cheap-source-map',
}
```

5. [splitChunks.name](https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunksname) 不能设置为true

拆分 chunk 的名称。设为 false 将保持 chunk 的相同名称，因此不会不必要地更改名称。

