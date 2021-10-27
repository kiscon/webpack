const path = require('path')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ENV = require('./env')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const baseCssLoader = () => {
  return [
    // https://vue-loader.vuejs.org/guide/extract-css.html#webpack-4
    ENV.isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
    'css-loader',
    'postcss-loader'
  ]
}

// 设置打包的文件路径
const assetsPath = _path => {
  return path.posix.join(ENV.assetsPath, _path)
}

// 配置eslint规则，// https://vue-loader.vuejs.org/zh/guide/linting.html#eslint
const setEslintRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre', // 编译前检查
  include: [resolve('src')], // 指定检查的目录
  exclude: /node_modules/, // 不检测的文件
  options: {
    formatter: require('eslint-friendly-formatter'), // 指定错误报告的格式规范
    emitWarning: true
  }
})

module.exports = {
	entry: {
		main: `./src/${ENV.projectPath}/main.js`,
	},
	output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': resolve('src'),
    }
  },
	plugins: [
		// new CleanWebpackPlugin(),
    // https://www.npmjs.com/package/copy-webpack-plugin
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        globOptions: {
          ignore: ['.*']
        }
      }]
    }),
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
        use: [
          ENV.isProd ? 'happypack/loader?id=happyBabel' : 'babel-loader'
        ],
				exclude: '/node_modules/',
				include: path.resolve('../src')
			},
			// html中img标签的图片资源处理
			{
				test: /\.(htm|html)$/i,
				use: 'html-withimg-loader'
      },
      ...(ENV.isProd ? [] : [setEslintRule()]), // 打包时不启用eslint
		]
	}
}