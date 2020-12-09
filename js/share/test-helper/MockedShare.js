/* eslint-disable no-underscore-dangle */

module.exports = class MockedShare {
	constructor(isOpen, lat, lng, text) {
		this._isOpen = isOpen;
		this._lat = lat;
		this._lng = lng;
		this._text = text;
	}

	static build(isOpen, lat, lng, text) {
		return new MockedShare(isOpen, lat, lng, text);
	}

	static buildClosed() {
		return new MockedShare(false, 0, 0, '');
	}

	static buildOpenWithoutText(lat, lon) {
		return new MockedShare(true, lat, lon, '');
	}

	static buildOpenWithText(lat, lon, text) {
		return new MockedShare(true, lat, lon, text);
	}

	isOpen() {
		return this._isOpen;
	}

	getMarkerPosition() {
		return {
			lat: this._lat,
			lng: this._lng,
		};
	}

	getText() {
		return this._text;
	}
};
