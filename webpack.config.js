const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	entry: './src/main.js',
	output: {
		// path.resolve：解析当前相对路径的绝对路径
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	mode: 'development', // 开发模式配置，默认production
	watch: true, // 开启监视模式，此时webpack指令进行打包会监视文件变化自动打包
	devServer: {
		open: true, // 自动开启
		hot: true,
		port: 5000,
		compress: true, //开启压缩
		// contentBase: './src'
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html'
		})
	],
	module: {
		rules: [
			// webpack读取loader时是从右到左的读取，会将css文件先交给最右侧的loader来处理
			// loader的执行顺序是管道的方式链式调用
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
				// css-loader：解析css文件
				// style-loader：将解析出来的结果，放到html中，使其生效
			},
			{
				test: /\.less$/,
				use: ['style-loader', 'css-loader', 'less-loader']
			},
			{
				test: /\.s(a|c)ss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
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
			}
		]
	}
}