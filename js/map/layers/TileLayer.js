import L from 'leaflet';
import 'leaflet-providers'; // Creates L.tileLayer.provider function

import Layer from './Layer';

export default class TileLayer extends Layer {
	constructor(id, title, layerId, options = {}) {
		super(id, title);

		this.layerId = layerId;
		this.attribution = options.attribution || undefined;
		this.apikey = options.apikey || undefined;
		this.leafletLayer = null;
	}

	getLeafletLayer() {
		if (this.leafletLayer === null) {
			const options = {
				id: this.id,
			};
			if (this.attribution !== undefined) {
				options.attribution = this.attribution;
			}
			if (this.apikey !== undefined) {
				options.apikey = this.apikey;
			}
			this.leafletLayer = L.tileLayer.provider(this.layerId, options);
		}
		return this.leafletLayer;
	}
}
