const path = require('path');

// const mode = process.env.NODE_ENV || 'development';

const config = {
	// entry: {
	// 		// Note: Paths in the `stylesheets` variable will be added here automatically
	// 		index: './electron/index.ts',
	// 		preload: './electron/preload.ts'
	// },
	// Note: Paths in the `stylesheets` variable will be added here automatically,
	entry: './svelte/index.ts',
	resolve: {
		// alias: {
		// 	// Note: Additional aliases will be loaded automatically = `tsconfig.compilerOptions.paths`
		// 	svelte: path.resolve('node_modules', 'svelte'),
		// },
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
		// mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	output: {
		filename: '[name].js',
	},
	module: {
		rules: [
			// Add support for native node modules
			{
				// We're specifying native_modules in the test because the asset relocator loader generates a
				// "fake" .node file which is really a cjs file.
				test: /native_modules\/.+\.node$/,
				use: 'node-loader',
			},
			{
				test: /\.(m?js|node)$/,
				parser: { amd: false },
				use: {
					loader: '@vercel/webpack-asset-relocator-loader',
					options: {
						outputAssetBase: 'native_modules',
					},
				},
			},
			{
				test: /\.tsx?$/,
				exclude: /(node_modules|\.webpack)/,
				use: {
					loader: 'ts-loader',
					options: {
						transpileOnly: true
					}
				}
			},
		],
	},
	// mode
};

module.exports = config;