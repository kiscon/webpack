const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')

const app = express()
const complier = webpack(config)

app.use(webpackDevMiddleware(complier, {
	publicPath: '/'
}))

app.listen(3000, () => {
	console.log('http:localhost:3000')
})