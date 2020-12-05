/* istanbul ignore file */
/* globals window */

const $ = require('jquery');

/* Some functionality works differently on mobile screens (autofocus, icon size, search, etc) */
module.exports = class MobileDetector {
	static isMobile() {
		return $(window).width() < 699;
	}
};
