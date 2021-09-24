const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const mode = process.env.NODE_ENV || 'development';
const dev = mode === "development";

const config = {
	plugins: [
			//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
			tailwindcss('./tailwind.config.js'),
			//But others, like autoprefixer, need to run after,
			autoprefixer(),
			!dev && cssnano({
			preset: "default",
		})
	],
};

module.exports = config;