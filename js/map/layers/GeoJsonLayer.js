import L from 'leaflet';
import log from 'loglevel';

import Ajax from '../../common/Ajax';

import Layer from './Layer';

export default class GeoJsonLayer extends Layer {
	constructor(id, title, url) {
		super(id, title);

		this.url = url;
		this.loading = false;
		this.loaded = false;

		this.leafletLayer = L.geoJson(null, {
			id: this.id,
		});
	}

	async ensureLoaded() {
		if (this.loaded || this.loading) return;

		if (!this.url) throw new Error('Layer url must be set');

		this.loading = true;
		const result = await Ajax.get(this.url);
		if (result) {
			try {
				this.leafletLayer.addData(result);
				this.loaded = true;
			} catch (error) { // ex. Invalid GeoJson
				log.warn(error.message);
			}
		}
		this.loading = false;
	}

	getLeafletLayer() {
		return this.leafletLayer;
	}
}
