/* global document */

const $ = require('jquery');
const L = require('leaflet');

// Add L.mapquest
const mapJs = 'https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest-core.js';

const apiKey = 'Fmjtd%7Cluu829ur25%2C82%3Do5-9w1gqr';

module.exports = class DirectionsApi {
	constructor() {
		this.ready = false;
		this.loading = false;

		this.directions = {};
		$(document).ready(() => {
			setTimeout(() => {
				this.loadJs();
			}, 500);
		});
	}

	loadJs() {
		if (this.loading || this.ready) return;

		this.loading = true;

		$.getScript(mapJs)
			.done(() => {
				L.mapquest.key = apiKey;

				this.directions = L.mapquest.directions();

				this.loading = false;
				this.ready = true;
			});
	}

	route(options, cb) {
		if (!this.ready) cb('MapQuest library is not ready yet');

		return this.directions.route(options, cb);
	}

	directionsLayer(options) {
		if (!this.ready) throw new Error('MapQuest library is not ready yet');

		return L.mapquest.directionsLayer(options);
	}
};
