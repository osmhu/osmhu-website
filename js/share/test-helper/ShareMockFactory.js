/* eslint-disable no-underscore-dangle */

class ShareMock {
	constructor(isOpen, lat, lng, text) {
		this._isOpen = isOpen;
		this._lat = lat;
		this._lng = lng;
		this._text = text;
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
}

module.exports = class ShareMockFactory {
	static build(isOpen, lat, lng, text) {
		return new ShareMock(isOpen, lat, lng, text);
	}

	static buildClosed() {
		return new ShareMock(false, 0, 0, '');
	}

	static buildOpenWithoutText(lat, lon) {
		return new ShareMock(true, lat, lon, '');
	}

	static buildOpenWithText(lat, lon, text) {
		return new ShareMock(true, lat, lon, text);
	}
};
