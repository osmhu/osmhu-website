import present from 'present';
import log from 'loglevel';

import Ajax from '../common/Ajax';

// Source: https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
const overpassEndpoints = [
	'https://lz4.overpass-api.de/api/',
	'https://z.overpass-api.de/api/',
	'https://overpass.kumi.systems/api/',
	'https://maps.mail.ru/osm/tools/overpass/api/',
	'https://overpass.openstreetmap.ru/api/',
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

const ensureTrailingSlash = (url) => (url + (url.endsWith('/') ? '' : '/'));

export default class OverpassEndpoint {
	static get all() {
		return overpassEndpoints;
	}

	static async measureAllEndpointLoadTimes() {
		endpointLoadTimes = {};

		await asyncForEach(overpassEndpoints, async (measuredEndpoint) => {
			try {
				const endpointLoadTime = await OverpassEndpoint.measureEndpointLoadTime(measuredEndpoint);

				log.debug(`Endpoint ${measuredEndpoint} load time was ${Math.round(endpointLoadTime)}ms`);

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

	static async measureEndpointLoadTime(endpoint) {
		const measureUrl = endpoint + 'interpreter?data=[out:json];node(47.48,19.02,47.5,19.05)["amenity"="cafe"];out;';

		const start = present();

		const result = await Ajax.get(measureUrl);

		const end = present();

		const resultIsValid = result instanceof Object;
		if (!resultIsValid) {
			throw new Error('Response is not Object, it was ' + (typeof result) + ': ' + result);
		}

		const elapsedMilliseconds = end - start;
		return elapsedMilliseconds;
	}

	static get fastestEndpoint() {
		const roundedLoadTime = Math.round(endpointLoadTimes[fastestEndpoint]);
		const measurement = Number.isNaN(roundedLoadTime) ? ' not measured' : ` with ${roundedLoadTime}ms`;
		log.debug(`Fastest endpoint is ${fastestEndpoint}` + measurement);
		return ensureTrailingSlash(fastestEndpoint);
	}

	static get randomEndpoint() {
		const randomEndpointIndex = Math.floor(Math.random() * overpassEndpoints.length);
		const randomOverpassEndpoint = overpassEndpoints[randomEndpointIndex];
		if (!randomOverpassEndpoint) {
			log.error(`Could not select random endpoint from ${overpassEndpoints} with index ${randomEndpointIndex}`);
		}
		return ensureTrailingSlash(randomOverpassEndpoint);
	}
}
