const L = require('leaflet');

const Layer = require('./Layer');

module.exports = class TileLayer extends Layer {
	constructor(id, displayName, url, maxZoom) {
		super(id, displayName, url);

		if (maxZoom == null) throw new Error('Layer max zoom must be set');

		this.maxZoom = maxZoom;

		this.layer = L.tileLayer(this.url, {
			id: this.id,
			maxZoom: this.maxZoom,
			subdomains: this.subdomains,
			attribution: this.attribution,
		});
	}
};
