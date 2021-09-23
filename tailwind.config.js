const colors = require('tailwindcss/colors');

const config = {
	purge: {
		// enabled: true,
		content: ["./src/**/*.{html,js,svelte,ts}"],
	},
	theme: {
		textColor: theme => ({
			...theme('colors'),
			'orange': '#fc692f',
			'heading': 'white',
			'sub-heading': '#d1d2d3',
			'xbox': '#0e7a0d'
		}),
		backgroundColor: theme => ({
			...theme('colors'),
			'main-color': '#212121',
			'sub-color': '#383838' 
		}),
		gradientColorStops: theme => ({
			...theme('colors'),
			'main-color': '#212121'
		}),
		extend: {},
	},
	plugins: [],
};

module.exports = config;
