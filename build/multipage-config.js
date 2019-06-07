const HtmlWebpackPlugin = require('html-webpack-plugin')

const moreHtmlArr = [
	{
		filename: 'other.html',
		template: './src/pages/other/other.html',
		chunks: ['other']
	},
	{
		filename: 'main-test.html',
		template: './src/pages/main-test/main-test.html',
		chunks: ['main-test']
	}
]
const moreEntry = {
	other: './src/pages/other/other.js',
	'main-test': './src/pages/main-test/main-test.js',
}
const moreHtml = () => {
	let arr = []
	moreHtmlArr.forEach(item => {
		arr.push(new HtmlWebpackPlugin(item))
	})
	return arr
}

module.exports = {
	moreEntry,
	moreHtml: moreHtml()
}