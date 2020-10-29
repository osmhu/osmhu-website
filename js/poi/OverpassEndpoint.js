const present = require('present');
const log = require('loglevel');

const Ajax = require('../Ajax');

log.setDefaultLevel('info');

// Source: https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
const overpassEndpoints = [
	'https://lz4.overpass-api.de/api/',
	'https://z.overpass-api.de/api/',
	'https://overpass.openstreetmap.fr/api/',
	'https://overpass.kumi.systems/api/',
];

let fastestEndpoint = overpassEndpoints[0];
let endpointLoadTimes = {};

// Source: https://gist.github.com/Atinux/fd2bcce63e44a7d3addddc166ce93fb2
const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		// eslint-disable-next-line no-await-in-loop
		await callback(array[index], index, array);
	}
};

module.exports = class OverpassEndpoint {
	static get all() {
		return overpassEndpoints;
	}

	static async measureEndpointLoadTimes() {
		endpointLoadTimes = {};

		await asyncForEach(overpassEndpoints, async (measuredEndpoint) => {
			try {
				const endpointLoadTime = await OverpassEndpoint.measureEndpoint(measuredEndpoint);

				log.debug('Endpoint', measuredEndpoint, 'load time was', endpointLoadTime, 'ms');

				endpointLoadTimes[measuredEndpoint] = endpointLoadTime;

				const fastestEndpointNotMeasured = !Object.prototype.hasOwnProperty.call(endpointLoadTimes, fastestEndpoint);
				const currentEndpointFasterThanFastest = endpointLoadTimes[fastestEndpoint] > endpointLoadTime;
				if (fastestEndpointNotMeasured || currentEndpointFasterThanFastest) {
					fastestEndpoint = measuredEndpoint;
				}
			} catch (error) {
				log.debug('Endpoint', measuredEndpoint, 'did not load with error: ', error);
			}
		});
	}

	static async measureEndpoint(endpoint) {
		const measureQuery = 'interpreter?data=[out:json];node(47.48,19.02,47.5,19.05)["amenity"="cafe"];out;';

		const start = present();

		const measureUrl = endpoint + measureQuery;
		const result = await Ajax.get(measureUrl);

		const resultIsValid = result instanceof Object;
		if (!resultIsValid) {
			throw new Error('Response is not Object, it was ' + (typeof result) + ': ' + result);
		}

		const end = present();
		const elapsedMilliseconds = end - start;
		return elapsedMilliseconds;
	}

	static get fastestEndpoint() {
		log.debug('Fastest endpoint is', fastestEndpoint, ' (', endpointLoadTimes[fastestEndpoint], 'ms)');
		return OverpassEndpoint.ensureUrlHasTrailingSlash(fastestEndpoint);
	}

	static ensureUrlHasTrailingSlash(url) {
		let returnedUrl = url;
		if (url.substring(url.length - 1) !== '/') {
			returnedUrl += '/';
		}
		return returnedUrl;
	}
};
