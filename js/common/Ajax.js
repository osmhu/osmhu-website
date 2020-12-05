/* istanbul ignore file */

const $ = require('jquery');

module.exports = class Ajax {
	static get(url) {
		return $.ajax({
			url,
		});
	}

	static getWithParams(url, params) {
		return $.ajax({
			url,
			data: params,
		});
	}
};
