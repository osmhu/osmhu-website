/* istanbul ignore file */
/* globals window */

import $ from 'jquery';

/* Some functionality works differently on mobile screens (autofocus, icon size, search, etc) */
export default class MobileDetector {
	static isMobile() {
		return $(window).width() < 699;
	}
}
