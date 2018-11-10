const L = require('leaflet');
const axios = require('axios');

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

		if (this.url == null) throw new Error('Layer url must be set');

		this.loading = true;

		const response = await axios.get(this.url);

		if (response.data) {
			this.layer.addData(response.data);
		}

		this.loading = false;
		this.loaded = true;

		return true;
	}
};
