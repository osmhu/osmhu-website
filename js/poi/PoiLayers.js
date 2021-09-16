import UrlParamChangeNotifier from '../url/UrlParamChangeNotifier';

import PoiLayer from './PoiLayer';

export default class PoiLayers {
	constructor(map) {
		this.map = map;
		this.poiLayers = {};
	}

	add(layerId) {
		if (layerId.length === 0) return;

		if (this.isActive(layerId)) return;

		this.poiLayers[layerId] = new PoiLayer(layerId, this.map);
		UrlParamChangeNotifier.trigger();
	}

	getAllLayerIds() {
		return Object.keys(this.poiLayers);
	}

	toggle(layerId) {
		if (this.isActive(layerId)) {
			this.remove(layerId);
		} else {
			this.add(layerId);
		}
	}

	isActive(layerId) {
		return Object.prototype.hasOwnProperty.call(this.poiLayers, layerId);
	}

	remove(layerId) {
		if (!this.isActive(layerId)) return;

		this.poiLayers[layerId].remove();
		delete this.poiLayers[layerId];
		UrlParamChangeNotifier.trigger();
	}

	removeAll() {
		Object.keys(this.poiLayers).forEach((layerId) => {
			this.remove(layerId);
		});
		UrlParamChangeNotifier.trigger();
	}
}
