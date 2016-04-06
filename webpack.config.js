let webpack = require('webpack');

module.exports = {
	entry: ['./src/app.js'],
	output: {
		filename: 'js/main.js'
	},
	resolve: {
		alias: {},
		modulesDirectories: [
			'node_modules',
			"web_modules"
		],
	},
	target: 'web',
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel!eslint',
				exclude: /node_modules|web_modules/
			},
			{
				test: /\.jade$/,
				loader: 'jade-loader'
			},
			{
				test: /\.styl$/,
				loader: 'style!css!stylus'
			},
			{
				test: /\.(vert|frag|glsl)$/,
				loader: 'raw!glslify'
			}
		]
	},
	glslify: {
		use: [require('glslify-import')]
	},
	stylus: {
		use: [require('nib')()]
	},
	eslint: {
		configFile: './.eslintrc',
		formatter: require('eslint-friendly-formatter'),
		failOnError: true
	},
	plugins: [
		new webpack.IgnorePlugin(/vertx/),
		new webpack.ProvidePlugin({
			THREE: 'three',
			jQuery: 'jquery',
			$: 'jquery',
			TWEEN: 'tween'
		})
	]
};