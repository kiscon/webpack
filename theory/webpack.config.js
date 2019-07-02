const path = require('path')

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
	mode: 'development'
}