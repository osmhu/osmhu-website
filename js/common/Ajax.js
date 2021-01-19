/* istanbul ignore file */

import $ from 'jquery';

export default class Ajax {
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
}
