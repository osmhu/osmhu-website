import L from 'leaflet';

import Layer from './Layer';

const attribution = '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők';

export default class CustomTileLayer extends Layer {
	constructor(options = {}) {
		super(options.id, options.title);

		this.url = options.url || '';

		this.maxZoom = options.maxZoom || 20;
		this.maxNativeZoom = options.maxNativeZoom || this.maxZoom;
		this.subdomains = options.subdomains || 'abc';
		this.attribution = options.attribution || attribution;

		this.leafletLayer = null;
	}

	getLeafletLayer() {
		if (this.leafletLayer === null) {
			this.leafletLayer = L.tileLayer(this.url, {
				id: this.id,
				maxZoom: this.maxZoom,
				maxNativeZoom: this.maxNativeZoom,
				subdomains: this.subdomains,
				attribution: this.attribution,
			});
		}

		return this.leafletLayer;
	}
}
