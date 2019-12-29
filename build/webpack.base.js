const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HappyPack = require('happypack')
let outputDir = process.env.outputDir || 'dist'
function resolve (dir) {
	return path.resolve(__dirname, dir)
}
module.exports = {
	entry: {
		main: './src/main.js',
	},
	output: {
		// path.resolve：解析当前相对路径的绝对路径
		path: path.resolve(__dirname, '..', outputDir),
		filename: '[name].js'
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
			chunks: ['main'],
			// 压缩 去掉所有空格
			minify: {
				collapseWhitespace: true //false | true
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
		new webpack.BannerPlugin('webpaxk入门到进阶'),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		// 不打包moment的语言包
		new webpack.IgnorePlugin(/\.\/locale/, /moment/),
		new webpack.DllReferencePlugin({
			manifest: resolve('../dist/manifest.json')
		}),
		new AddAssetHtmlPlugin({
			filepath: resolve('../dist/vue_dll.js')
		}),
		// new HappyPack({
		// 	loaders: ['babel-loader']
		// })
	],
	module: {
		noParse: /jquery/,
		rules: [
			// webpack读取loader时是从右到左的读取，会将css文件先交给最右侧的loader来处理
			// loader的执行顺序是管道的方式链式调用
			{
				test: /\.css$/,
				// use: ['style-loader', 'css-loader']
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
				// css-loader：解析css文件
				// style-loader：将解析出来的结果，放到html中，使其生效
			},
			{
				test: /\.less$/,
				// use: ['style-loader', 'css-loader', 'less-loader']
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
			},
			{
				test: /\.s(a|c)ss$/,
				// use: ['style-loader', 'css-loader', 'fast-sass-loader']
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'fast-sass-loader']
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
				include: resolve('../src')
			},
			// html中img标签的图片资源处理
			{
				test: /\.(htm|html)$/i,
				use: 'html-withimg-loader'
			}
		]
	}
}