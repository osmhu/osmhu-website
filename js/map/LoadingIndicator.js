/* istanbul ignore file */

const $ = require('jquery');

module.exports = class LoadingIndicator {
	static setLoading(isLoading) {
		if (isLoading) {
			$('body').addClass('loading');
		} else {
			$('body').removeClass('loading');
		}
	}
};
