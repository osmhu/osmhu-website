const $ = require('jquery');

const UrlHelper = require('./UrlHelper');
const HistoryApi = require('./HistoryApi');
const Marker = require('../marker/Marker');
const PoiLayer = require('../poi/PoiLayer');

module.exports = class Url {
	constructor(mapInstance, share) {
		this.map = mapInstance;
		this.share = share;
		this.bindUrlUpdateHooks = this.bindUrlUpdateHooks.bind(this);
		this.update = this.update.bind(this);
	}

	bindUrlUpdateHooks() {
		this.map.setChangeNotifierCallback(this.update);
		Marker.setChangeNotifierCallback(this.update);
		PoiLayer.setChangeNotifierCallback(this.update);
		this.share.setChangeNotifierCallback(this.update);
	}

	createQueryString() {
		const queryStringParts = [];

		queryStringParts.push('zoom=' + this.map.getZoom());

		if (!Marker.getActivePoiPopup()) {
			let center;
			if (this.share.isOpen()) {
				center = this.share.getMarkerPosition();
			} else {
				center = this.map.getCenter();
			}

			const lat = UrlHelper.roundToFiveDigits(center.lat);
			const lon = UrlHelper.roundToFiveDigits(center.lng);

			if (this.share.isOpen()) {
				queryStringParts.push('mlat=' + lat);
				queryStringParts.push('mlon=' + lon);
			} else {
				queryStringParts.push('lat=' + lat);
				queryStringParts.push('lon=' + lon);
			}
		}

		const markerTextSet = this.share.isOpen() && this.share.getText().length > 0;

		if (markerTextSet) {
			const markerText = encodeURIComponent(this.share.getText());
			queryStringParts.push('mtext=' + markerText);
		}

		const activeBaseLayerIdDifferentFromDefault = this.map.getActiveBaseLayerId() !== 'M';
		if (activeBaseLayerIdDifferentFromDefault) {
			queryStringParts.push('layer=' + this.map.getActiveBaseLayerId());
		}

		Array.prototype.forEach.call(this.map.getActiveOverlayIds(), (overlayId) => {
			queryStringParts.push(overlayId + '=1');
		});

		try {
			if (!Marker.getActivePoiPopup()) {
				queryStringParts.push('poi=' + PoiLayer.getActivePoiLayerSearchId());
			}
		} catch (error) {
			// Poi layer not active
		}

		if (Marker.getActivePoiPopup()) {
			queryStringParts.push('type=' + Marker.getActivePoiPopup().type);
			queryStringParts.push('id=' + Marker.getActivePoiPopup().id);
		}

		return '?' + queryStringParts.join('&');
	}

	update() {
		const queryString = this.createQueryString();
		$('input.share-url').val('https://www.openstreetmap.hu' + queryString);
		HistoryApi.replaceState(queryString);
		this.updateOrgUrls();
	}

	createOsmDotOrgQueryString() {
		const lat = UrlHelper.roundToFiveDigits(this.map.getCenter().lat);
		const lon = UrlHelper.roundToFiveDigits(this.map.getCenter().lng);
		return '#map=' + this.map.getZoom() + '/' + lat + '/' + lon;
	}

	updateOrgUrls() {
		const orgQueryString = this.createOsmDotOrgQueryString();
		$('a#orglink').attr('href', 'https://openstreetmap.org/' + orgQueryString);
		$('a#orgEditLink').attr('href', 'https://openstreetmap.org/edit' + orgQueryString);
	}
};
