import L from 'leaflet';
import log from 'loglevel';

import Ajax from '../../common/Ajax';

import Layer from './Layer';

export default class GeoJsonLayer extends Layer {
	constructor(id, displayName, url) {
		super(id, displayName, url);

		this.loading = false;
		this.loaded = false;

		this.layer = L.geoJson(null, {
			id: this.id,
		});
	}

	async ensureLoaded() {
		if (this.loaded) {
			return true;
		}
		if (this.loading) return false;

		/* istanbul ignore if */
		if (!this.url) throw new Error('Layer url must be set');

		this.loading = true;

		const result = await Ajax.get(this.url);

		/* istanbul ignore else */
		if (result) {
			try {
				this.layer.addData(result);
			} catch (error) { // ex. Invalid GeoJson
				/* istanbul ignore next */
				log.warn(error.message);
			}
		}

		this.loading = false;
		this.loaded = true;

		return true;
	}
}
