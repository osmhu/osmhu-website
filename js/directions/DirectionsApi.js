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
	}

	async loadJs() {
		if (this.loading || this.ready) return Promise.resolve();

		this.loading = true;

		return new Promise((resolve, reject) => {
			$.getScript(mapJs)
				.done(() => {
					L.mapquest.key = apiKey;

					this.directions = L.mapquest.directions();

					this.loading = false;
					this.ready = true;
					resolve();
				})
				.fail((jqxhr, settings, exception) => {
					this.loading = false;
					reject(new Error('Failure while loading Mapquest.js: ' + exception));
				});
		});
	}

	async route(options) {
		if (!this.ready) {
			await this.loadJs();
		}

		return new Promise((resolve, reject) => {
			this.directions.route(options, (error, response) => {
				const errorIsEmpty = Object.keys(error).length === 0 && error.constructor === Object;
				if (error instanceof Error) {
					reject(error);
				} else if (!errorIsEmpty) {
					reject(new Error(error));
				} else if (response) {
					resolve(response);
				}
			});
		});
	}

	async directionsLayer(options) {
		if (!this.ready) {
			await this.loadJs();
		}

		return L.mapquest.directionsLayer(options);
	}
};
