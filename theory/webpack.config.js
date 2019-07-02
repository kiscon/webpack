const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{test: /\.js$/, use: './loaders/loader.js', enforce: 'pre'}
		]
	},
	mode: 'development'
}