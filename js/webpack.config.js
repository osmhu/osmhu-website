const path = require('path');

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
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks: 'all',
		},
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
				use: {
					loader: 'babel-loader',
					options: { // all babel-loader options must be mirrored in .babelrc
						sourceType: 'unambiguous',
						presets: [[
							'@babel/preset-env',
							{
								// debug: true,
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
