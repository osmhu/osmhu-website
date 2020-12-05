const UrlParamChangeNotifier = require('../url/UrlParamChangeNotifier');
const LoadingIndicator = require('../common/LoadingIndicator');

const PoiLayer = require('./PoiLayer');

module.exports = class PoiLayers {
	constructor(map) {
		this.map = map;
		this.poiLayers = {};
	}

	addBySearchId(searchId) {
		if (searchId.length === 0) return;

		const onLoadingStateChanged = (isLoading) => {
			LoadingIndicator.setLoading(isLoading);
		};

		this.poiLayers[searchId] = new PoiLayer(this.map, searchId, onLoadingStateChanged);
		UrlParamChangeNotifier.trigger();
	}

	getAllSearchIds() {
		return Object.keys(this.poiLayers);
	}

	removeBySearchId(searchId) {
		if (!Object.prototype.hasOwnProperty.call(this.poiLayers, searchId)) {
			return;
		}

		this.poiLayers[searchId].remove();
		delete this.poiLayers[searchId];
		UrlParamChangeNotifier.trigger();
	}

	removeAll() {
		Object.keys(this.poiLayers).forEach((searchId) => {
			this.removeBySearchId(searchId);
		});
		UrlParamChangeNotifier.trigger();
	}
};
