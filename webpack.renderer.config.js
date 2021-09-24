const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Preprocess = require('svelte-preprocess');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

/**
 * Should source maps be generated alongside your production bundle? This will expose your raw source code, so it's
 * disabled by default.
 */
const sourceMapsInProduction = false;

/**
 * One or more stylesheets to compile and add to the beginning of the bundle. By default, SASS, SCSS and CSS files are
 * supported. The order of this array is important, as the order of outputted styles will match. Svelte component
 * styles will always afpear last in the bundle.
 */

// Note: Paths in the `stylesheets` variable will be added here automatically
let stylesheets = ['./svelte/styles/index.scss'];

const config = {
	entry: [
		'./svelte/renderer.ts'
	],
	resolve: {
		alias: {
			// Note: Additional aliases will be loaded automatically = `tsconfig.compilerOptions.paths`
			svelte: path.resolve('node_modules', 'svelte'),
		},
		extensions: ['.mjs', '.js', '.ts', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
	},
	output: {
		path: path.join(__dirname, './.webpack/build'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader-hot',
					options: {
						dev: !prod,
						emitCss: prod,
						hotReload: !prod,
						hotOptions: {
							// List of options and defaults: https://www.npmjs.com/package/svelte-loader-hot#usage
							noPreserveState: false,
							optimistic: true,
						},
						preprocess: Preprocess({
							typescript: true,
							scss: true
						}),
					},
				},
			},
			{
				test: /\.(scss|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'postcss-loader'
				],
			},
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
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'bundle.css',
		}),
	],
	optimization: {
		minimizer: [],
	},
	devtool: prod && !sourceMapsInProduction ? false : 'source-map',
};

// Add stylesheets to the build
if (Array.isArray(stylesheets) || typeof stylesheets === 'string') {
	if (!Array.isArray(stylesheets)) {
		stylesheets = [stylesheets];
	}

	// Make sure our entry bundle is in the correct format
	if (typeof config.entry === 'object' && !Array.isArray(config.entry)) {
		if (typeof config.entry.bundle !== 'undefined') {
			// Convert the bundle to an array if necessary
			if (!Array.isArray(config.entry.bundle)) {
				config.entry.bundle = [config.entry.bundle];
			}

			// Add to the beginning of the bundle using unshift
			config.entry.bundle.unshift.apply(
				config.entry.bundle,
				stylesheets
			);
		}
	}
}

// Load path mapping = tsconfig
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
const tsconfig = require('fs').existsSync(tsconfigPath) ? require(tsconfigPath) : {};

if ('compilerOptions' in tsconfig && 'paths' in tsconfig.compilerOptions) {
    const aliases = tsconfig.compilerOptions.paths;
    for (const alias in aliases) {
        const paths = aliases[alias].map((p) => path.resolve(__dirname, p));

        // Our tsconfig uses glob path formats, whereas webpack just wants directories
        // We'll need to transform the glob format into a format acceptable to webpack
        const wpAlias = alias.replace(/(\\|\/)\*$/, '');
        const wpPaths = paths.map((p) => p.replace(/(\\|\/)\*$/, ''));

        if (!(wpAlias in config.resolve.alias) && wpPaths.length) {
            config.resolve.alias[wpAlias] = wpPaths.length > 1 ? wpPaths : wpPaths[0];
        }
    }
}

// These options should only apply to production builds
if (prod) {
	// Clean the build directory for production builds
	config.plugins.push(new CleanWebpackPlugin());

	// Minify CSS
	config.optimization.minimizer.push(
		new OptimizeCSSAssetsPlugin({
			cssProcessorOptions: {
				map: sourceMapsInProduction
					? {
							inline: false,
							annotation: true,
						}
					: false,
			},
			cssProcessorPluginOptions: {
				preset: [
					'default',
					{
						discardComments: {
							removeAll: !sourceMapsInProduction,
						},
					},
				],
			},
		})
	);

	// Minify and treeshake JS
	config.optimization.minimizer.push(
		new TerserPlugin({
			extractComments: false,
		})
	);
}

module.exports = config;