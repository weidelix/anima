const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const config = {
	purge: {
		enabled: prod,
		content: ["./src/**/*.{html,js,svelte,ts}"],
	},
	theme: {
		fontFamily: {
			'main': '"Fredoka One"'
		},
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
	variants: {
		extend: {
			transform: ['hover', 'focus']
		}
	},
	plugins: [],
};

module.exports = config;
