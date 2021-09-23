const path = require('path');
const mode = process.env.NODE_ENV || 'development';

const config = {
	entry: {
			// Note: Paths in the `stylesheets` variable will be added here automatically
			main: './electron/main.ts',
			preload: './electron/preload.ts'
	},
	resolve: {
		alias: {
			// Note: Additional aliases will be loaded automatically = `tsconfig.compilerOptions.paths`
			svelte: path.resolve('node_modules', 'svelte'),
		},
		extensions: ['.mjs', '.js', '.ts', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].js',
	},
	module: {
		rules: [
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
	mode
};

module.exports = config;