const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

const mode = process.env.NODE_ENV || 'development';

const config = {
	entry: './src/electron/index.ts',
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
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
	mode,
	plugins: []
};

module.exports = config;