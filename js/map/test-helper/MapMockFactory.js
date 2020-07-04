/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */

class MockedMap {
	constructor(zoom, lat, lng, baseLayerId, overlayIds) {
		this._zoom = zoom;
		this._lat = lat;
		this._lng = lng;
		this._baseLayerId = baseLayerId;
		this._overlayIds = overlayIds;
	}

	getZoom() {
		return this._zoom;
	}

	getCenter() {
		return {
			lat: this._lat,
			lng: this._lng,
		};
	}

	getActiveBaseLayerId() {
		return this._baseLayerId || 'M';
	}

	getActiveOverlayIds() {
		return this._overlayIds || [];
	}

	addLayer() {}

	removeLayer() {}
}

module.exports = class MapMockFactory {
	static build(zoom, lat, lng, baseLayerId, overlayIds) {
		return new MockedMap(zoom, lat, lng, baseLayerId, overlayIds);
	}
};
