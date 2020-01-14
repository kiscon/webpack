const path = require('path')
const webpack = require('webpack')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const HappyPack = require('happypack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const outputDir = process.env.outputDir || 'dist'
const isProduction = process.env.NODE_ENV === 'production'

const baseCssLoader = () => {
  return [
    // https://vue-loader.vuejs.org/guide/extract-css.html#webpack-4
    isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    'css-loader',
    'postcss-loader'
  ]
}
// 设置打包的文件路径
const assetsPath = _path => {
  let assetsSubDirectory = process.env.assetsPath || 'static'
  return path.posix.join(assetsSubDirectory, _path)
}

module.exports = {
	entry: {
		main: './src/test/main.js',
	},
	output: {
    // path.resolve：解析当前相对路径的绝对路径
    // path.join(path1，path2...) 将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径
		path: path.resolve(__dirname, '..', outputDir),
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[name].[chunkhash].js')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.join(__dirname, '..', 'src')
    }
  },
	plugins: [
		// new CleanWebpackPlugin(),
    // new webpack.BannerPlugin('webpack'),

    // 提取到单独文件：mini-css-extract-plugin
		new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[chunkhash].css'),
    }),
    new CopyWebpackPlugin([
			{
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
			}
    ]),

		// new HappyPack({
		// 	loaders: ['babel-loader']
    // }),

    // 将你定义过的其它规则复制并应用到.vue 文件里相应语言的块。https://vue-loader.vuejs.org/zh/guide/#vue-cli
    new VueLoaderPlugin()
	],
	module: {
		// noParse: /jquery/,
		rules: [
			// webpack读取loader时是从右到左的读取，会将css文件先交给最右侧的loader来处理
			// loader的执行顺序是管道的方式链式调用
			{
				test: /\.css$/,
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
				use: baseCssLoader()
				// css-loader：解析css文件
				// style-loader：将解析出来的结果，放到html中，使其生效
			},
			{
				test: /\.less$/,
				use: [...baseCssLoader(), 'less-loader']
			},
			{
				test: /\.s(a|c)ss$/,
				use: [...baseCssLoader(), 'fast-sass-loader']
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|bmp|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					// loader: 'happypack/loader'
				},
				exclude: '/node_modules/',
				include: path.resolve('../src')
			},
			// html中img标签的图片资源处理
			{
				test: /\.(htm|html)$/i,
				use: 'html-withimg-loader'
			}
		]
	}
}