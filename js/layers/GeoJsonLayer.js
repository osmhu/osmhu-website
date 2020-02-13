const L = require('leaflet');
const log = require('loglevel');

const Ajax = require('../Ajax');
const Layer = require('./Layer');

module.exports = class GeoJsonLayer extends Layer {
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

		if (!this.url) throw new Error('Layer url must be set');

		this.loading = true;

		const result = await Ajax.get(this.url);

		if (result) {
			try {
				this.layer.addData(result);
			} catch (error) { // ex. Invalid GeoJson
				log.warn(error.message);
			}
		}

		this.loading = false;
		this.loaded = true;

		return true;
	}
};
