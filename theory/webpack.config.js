const path = require('path')
const HelloWorldPlugin = require('./plugins/HelloWorldPlugin.js')
// const HTMLPlugin = require('./plugins/HTMLPlugin.js')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			// {
			// 	test: /\.js$/, 
			// 	use: './loaders/loader2.js'
			// },
			{
				test: /\.js$/, 
				use: {
					loader: './loaders/loader1.js',
					options: {
						name: 'loader'
					}
				},
				enforce: 'pre'
			},
			// {
			// 	test: /\.js$/, 
			// 	use: [
			// 		'./loaders/loader1.js',
			// 		'./loaders/loader2.js',
			// 	]
			// }
		]
	},
	plugins: [
		new HelloWorldPlugin(),
		// new HTMLPlugin({
		// 	filename: 'index.html',
		// 	template: './src/index.html'
		// })
	],
	mode: 'development'
}