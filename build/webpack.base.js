const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HappyPack = require('happypack')
let outputDir = process.env.outputDir || 'dist'


const baseCssLoader = () => {
  return [
    // https://vue-loader.vuejs.org/guide/extract-css.html#webpack-4
    process.env.NODE_ENV !== 'production' ?  'vue-style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader'
  ]
}


module.exports = {
	entry: {
		main: './src/test/main.js',
	},
	output: {
		// path.resolve：解析当前相对路径的绝对路径
		path: path.resolve(__dirname, '..', outputDir),
		filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.join(__dirname, '..', 'src')
    }
  },
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/test/public/index.html',
			chunks: ['main'],
			// 压缩 去掉所有空格
			minify: {
				collapseWhitespace: true // false | true
			},
			hash: true
		}),
		// new CleanWebpackPlugin(),
		new CopyWebpackPlugin([
			{
				from: path.join(__dirname, '..', 'assets'),
				to: 'assets'
			}
		]),
    // new webpack.BannerPlugin('webpack'),

    // 提取到单独文件：mini-css-extract-plugin
		new MiniCssExtractPlugin({
			filename: '[name].css'
    }),
    
		// 不打包moment的语言包
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),

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
				test: /\.(jpg|jpeg|png|bmp|gif)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 5 * 1024, // 5kb
						outputPath: 'images',
						name: '[name]-[hash].[ext]'
					}
				}
			},
			{
				test: /\.(woff|woff2|eot|svg|ttf)$/,
				use: 'url-loader'
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