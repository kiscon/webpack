const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HappyPack = require('happypack')
const baseConfig = require('./webpack.base')
const ENV = require('./env')
// const pkg = require('../package.json')

// 设置打包的文件路径
const assetsPath = _path => {
  return path.join(ENV.assetsPath, _path)
}

module.exports = merge(baseConfig, {
	mode: 'production', // 开发模式配置，默认production
  devtool: 'eval-cheap-source-map',
  // https://www.webpackjs.com/configuration/stats/#stats
  stats: {
    children: false, // 默认true，是否添加children信息（设置为false，解决webpack4打包时出现：Entrypoint undefined = index.html）
    modules: false, // 默认true，是否添加构建模块信息
  },
  output: {
    // path.resolve：解析当前相对路径的绝对路径
    // path.join(path1，path2...) 将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径
		path: path.resolve(__dirname, '..', ENV.outputDir),
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[name].[chunkhash].js')
  },
	plugins: [
		new webpack.DefinePlugin({
			IS_DEV: 'false'
    }),
    // https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template:  `./src/${ENV.projectPath}/public/index.html`,
      favicon: `./src/${ENV.projectPath}/public/favicon.ico`,
      inject: true,
			// 压缩 去掉所有空格， https://github.com/DanielRuf/html-minifier-terser
			minify: {
        removeComments: true, // 删除HTML注释
        removeAttributeQuotes: true, // 尽可能删除属性周围的引号
				collapseWhitespace: true // 折叠有助于文档树中文本节点的空白
			}
    }),
    // 提取到单独文件：mini-css-extract-plugin
		new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[chunkhash].css'),
    }),
    // 使用DllReferencePlugin指定manifest.json文件的位置即可
		new webpack.DllReferencePlugin({
			manifest: require('../dll/xlib-manifest.json')
    }),
    // 使用add-asset-html-webpack-plugin插件自动添加script标签到HTML中
    // NODE_ENV !== 'smp' 判断，防止smp打包时候报错
    process.env.NODE_ENV !== 'smp' ? new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, '../dll/xlib.dll.*.js'),
      publicPath: '/static/js',
      outputPath: '../dist/static/js',
      includeSourcemap: false
    }) : function () {},
    // happypack可以将任务分解给多个子进程，最后将结果发给主进程，js是单线程模型，通过这种多线程的方式提高性能
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
    // 用于给打包的js文件加上版权注释信息，加上会多出.LICENSE和.map文件
    // new webpack.BannerPlugin(`${pkg.name}_${pkg.version}_${pkg.description}`),
	],
	optimization: {  
		minimizer: [
      // js压缩：用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题
			new TerserJSPlugin({
				test: /\.js(\?.*)?$/i,
        terserOptions: {
          // 生产环境自动删除console
          compress: {
            // warnings: false, // 若打包错误，则注释这行
            drop_debugger: true,
            drop_console: true,
            pure_funcs: ['console.log']
          }
        },
        parallel: true
      }),
       // css压缩
			new CssMinimizerPlugin()
    ],
    // 分割代码 https://webpack.docschina.org/plugins/split-chunks-plugin/
		splitChunks: {
			chunks: 'all', // 默认 async 表示只会对异步加载的模块进行代码切割，可选值还有all | initial
			minSize: 30000, // 最少大于30kB才拆分
			minChunks: 1, // 模块最少引用一次才会被拆分
			maxAsyncRequests: 5, // 异步加载时同时发送的请求数量最大不能超过5，超过5的部分不拆分
			maxInitialRequests: 3, // 页面初始化同时发送请求数量最大不超过3
			automaticNameDelimiter: '-', // 默认的连接符 ~
			cacheGroups: { // 缓存组配置
				public: { // 自定义缓存组名
					test: /[\\/]node_modules[\\/]/,
					priority: -10 // 权重-10，决定了哪个组优先匹配，例如node_modules下有个模块要拆分，同时满足vendors和default组，
					// 此时就会分到vendors组，因为-10>-20
				},
				default: { // 默认缓存组名
					minChunks: 2, // 最少引用两次才会被拆分
					priority: -20, // 权重-20
					reuseExistingChunk: true, // 如果主入口中引入了两个模块，其中一个正好也引用了后一个，就会直接复用，无需引用两次
				}
			}
		}
	}
})