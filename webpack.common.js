const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')

const rendererPath = path.resolve('src', 'renderer')

module.exports = {
	target: 'web',
	entry: {
		index: rendererPath,
		preferences: path.join(rendererPath, 'preferences.js'),
		help: path.join(rendererPath, 'help.js'),
		global: path.join(rendererPath, 'css', 'global.css')
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: '[name].bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									postcssPresetEnv({ stage: 0 })
								]
							}
						}
					}
				]
			},
			{
				test: /\.(svg|woff2)$/,
				use: ['url-loader']
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: path.join('assets', 'css', '[name].min.css')
		}),
		new HTMLWebpackPlugin({
			inject: false,
			filename: 'index.html',
			template: path.join(rendererPath, 'index.html')
		}),
		new HTMLWebpackPlugin({
			inject: false,
			filename: 'preferences.html',
			template: path.join(rendererPath, 'preferences.html')
		}),
		new HTMLWebpackPlugin({
			inject: false,
			filename: 'help.html',
			template: path.join(rendererPath, 'help.html')
		})
	],
}