// Support old browsers, eg IE 11

import 'core-js/stable';
import 'svgxuse';

import browserUpdate from 'browser-update';

browserUpdate({
	required: {
		i: 11, // Required IE version
	},
	l: 'hu', // Language
});
