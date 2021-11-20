import log from 'loglevel';

import Ajax from '../common/Ajax';

import OverpassQuery from './OverpassQuery';
import OverpassEndpoint from './OverpassEndpoint';

export default class Overpass {
	static async fetchByOsmElementIdWithRetry(osmElementId) {
		const query = OverpassQuery.generateQueryByOsmElementId(osmElementId);
		let result;
		let tryCount = 0;
		let success = false;
		do {
			try {
				tryCount += 1;
				if (tryCount === 1) {
					// eslint-disable-next-line no-await-in-loop
					result = await Ajax.get(OverpassEndpoint.fastestEndpoint + query);
				} else {
					// eslint-disable-next-line no-await-in-loop
					result = await Ajax.get(OverpassEndpoint.randomEndpoint + query);
				}
				success = true;
			} catch (error) {
				log.warn('Retrying because of error: Could not fetch Overpass for ' + osmElementId.toString() +
					': ' + error.statusText, error);
			}
		} while (!success);

		const overpassResult = result.elements.find((e) => parseInt(e.id, 10) === parseInt(osmElementId.id, 10));
		if (!overpassResult) throw new Error('Queried id was not found in overpass query results');

		return overpassResult;
	}
}
