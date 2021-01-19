import $ from 'jquery';

import Marker from '../marker/Marker';

import UrlHelper from './UrlHelper';
import HistoryApi from './HistoryApi';
import UrlParamChangeNotifier from './UrlParamChangeNotifier';

export default class Url {
	constructor(mapInstance, share, poiLayers) {
		this.map = mapInstance;
		this.share = share;
		this.poiLayers = poiLayers;
		this.update = this.update.bind(this);

		UrlParamChangeNotifier.setNotificationCallback(this.update);
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
				const searchIds = [];
				this.poiLayers.getAllSearchIds().forEach((searchId) => {
					searchIds.push(searchId);
				});
				if (searchIds.length > 0) {
					queryStringParts.push('poi=' + searchIds.join(','));
				}
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
}
