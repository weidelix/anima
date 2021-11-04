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
		ringColor: {
			'accent-green': '#34D399'
		},
		textColor: theme => ({
			...theme('colors'),
			'orange': '#fc692f',
			'heading': 'white',
			'sub-heading': '#d1d2d3',
			'accent-green': '#34D399',
			'xbox': '#0e7a0d'
		}),
		backgroundColor: theme => ({
			...theme('colors'),
			'main-color': '#181818',
			'sub-color': '#242424',
			'accent-green': '#34D399' ,
			'xbox': '#0e7a0d'
		}),
		gradientColorStops: theme => ({
			...theme('colors'),
			'main-color': '#181818',
			'accent-green': '#242424' 
		}),
		extend: {
			outline: {
				'accent-green': ['4px solid #34D399']
			},
		},
	},
	variants: {
		extend: {
			transform: ['hover', 'focus']
		}
	},
	plugins: [],
};

module.exports = config;
