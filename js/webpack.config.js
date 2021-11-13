const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env) => ({
	mode: env.development ? 'development' : 'production',
	devtool: env.development ? 'eval-source-map' : 'source-map',
	entry: {
		frontpage: {
			import: env.development ? ['./js/debug.js', './js/frontpage.js'] : ['./js/frontpage.js'],
		},
	},
	stats: env.development ? 'normal' : 'minimal', // console output verbosity
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, '../distribution/js'),
		environment: { // IE 11 compatibility (exclude es6 features in output)
			arrowFunction: false,
			destructuring: false,
		},
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks: 'all',
		},
		minimizer: [ // IE 11 compatibility (force minimizer to output es5 code)
			new TerserPlugin({
				parallel: true,
				terserOptions: { // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
					output: {
						ecma: 5,
					},
				},
			}),
		],
	},
	performance: {
		hints: false, // Hints about optimal package sizes
	},
	module: {
		rules: [
			{
				test: /\.worker\.js$/,
				use: {
					loader: 'worker-loader',
					options: {
						filename: '[name].js',
					},
				},
			},
			{
				test: /\.m?js$/,
				// exclude node_modules except some npm packages, which do not support ie11, so we need to transpile them
				// Source: https://github.com/babel/babel-loader#some-files-in-my-node_modules-are-not-transpiled-for-ie-11
				include: [
					path.resolve(__dirname),
					path.resolve(__dirname, '../node_modules/coordinate-parser'),
					path.resolve(__dirname, '../node_modules/query-string'),
					path.resolve(__dirname, '../node_modules/split-on-first'),
					path.resolve(__dirname, '../node_modules/strict-uri-encode'),
				],
				use: {
					loader: 'babel-loader',
					options: { // all babel-loader options must be mirrored in .babelrc
						sourceType: 'unambiguous',
						presets: [[
							'@babel/preset-env',
							{
								// debug: true,
								targets: {
									browsers: '>0.05% in hu, ie 11',
								},
							},
						]],
						plugins: [
							'@babel/plugin-transform-runtime',
						],
					},
				},
			},
		],
	},
});
