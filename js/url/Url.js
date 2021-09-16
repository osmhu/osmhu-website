import $ from 'jquery';

import Marker from '../marker/Marker';

import OsmOrgUrl from './OsmOrgUrl';
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
				const layerIds = [];
				this.poiLayers.getAllLayerIds().forEach((layerId) => {
					layerIds.push(layerId);
				});
				if (layerIds.length > 0) {
					queryStringParts.push('poi=' + layerIds.join(','));
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
		let shareUrl = 'https://www.openstreetmap.hu' + queryString;
		// eslint-disable-next-line no-underscore-dangle
		if (window.__DEV__) {
			// eslint-disable-next-line no-underscore-dangle
			shareUrl = window.__DEV_SHARE_URL__ + queryString;
		}
		$('input.send-location-url').val(shareUrl);
		$('input.share-url').val(shareUrl);
		HistoryApi.replaceState(queryString);
		this.updateOrgUrls();
	}

	updateOrgUrls() {
		$('a#orglink').attr('href', OsmOrgUrl.browseUrlFromMapCenterAndZoom(this.map.getCenter(), this.map.getZoom()));
		$('a#orgEditLink').attr('href', OsmOrgUrl.editUrlFromMapCenterAndZoom(this.map.getCenter(), this.map.getZoom()));
	}
}
