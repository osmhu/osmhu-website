/* globals window */

const $ = require('jquery');
const L = require('leaflet');
const log = require('loglevel');

const MobileDetector = require('../MobileDetector');
const CopyButton = require('../CopyButton');
const Coordinate = require('../poi/Coordinate');
const OverpassQuery = require('../poi/OverpassQuery');
const OverpassEndpoint = require('../poi/OverpassEndpoint');
const Ajax = require('../Ajax');
const UrlHelper = require('../url/UrlHelper');
const popup = require('../popup');
const IconProvider = require('../marker/IconProvider');

let changeNotifierCallback = null;
let activePoi = null;

log.setDefaultLevel('info');

module.exports = class Marker {
	static displayRedMarker(map, coordinates, text = '') {
		const redIcon = L.icon({
			iconUrl: 'kepek/marker-icon-red.png',
			iconAnchor: [13, 40],
		});

		const redMarker = L.marker(coordinates, {
			icon: redIcon,
		});

		redMarker.addTo(map);

		if (text.length > 0) {
			let html = '<div class="popup-loaded-marker">';
			html += UrlHelper.sanitizeTextForHtmlDisplay(text);
			html += '</div>';
			redMarker.bindPopup(html, {
				offset: L.point(0, -28),
			}).openPopup();
		}
	}

	static setChangeNotifierCallback(callback) {
		changeNotifierCallback = callback;
	}

	static triggerChangeNotifierCallback() {
		if (changeNotifierCallback) {
			changeNotifierCallback();
		}
	}

	static setActivePoi(elementType, elementId) {
		activePoi = {
			type: elementType,
			id: elementId,
		};
	}

	static removeActivePoi() {
		activePoi = null;
	}

	static getActivePoiPopup() {
		return activePoi;
	}

	static createFromOverpassResult(overpassResult) {
		const position = Coordinate.getCenterPositionOfOverpassResult(overpassResult);

		const customMarker = L.marker(position);

		const iconProvider = new IconProvider(overpassResult.tags);
		try {
			customMarker.setIcon(iconProvider.getFirstMatchingIcon());
		} catch (error) {
			log.info('No icon found for', overpassResult.type, overpassResult.id, 'tags were:', overpassResult.tags);
		}

		// Add popup to show poi information on marker click
		const popupHtml = popup.generateHtml(overpassResult);

		customMarker.bindPopup(popupHtml, {
			offset: L.point(0, 4),
			autoPanPaddingTopLeft: MobileDetector.isMobile() ? [44, 5] : [46, 10],
			autoPanPaddingBottomRight: MobileDetector.isMobile() ? [54, 5] : [56, 10],
		});

		// On popup open activate copy button
		customMarker.on('popupopen', () => {
			CopyButton.copyTargetOnButtonClick('#popup-poi-copy', '#popup-poi-share-url');

			Marker.setActivePoi(overpassResult.type, overpassResult.id);
			$(window).trigger('popup-open');
			Marker.triggerChangeNotifierCallback();
		});

		customMarker.on('popupclose', () => {
			Marker.removeActivePoi();
			Marker.triggerChangeNotifierCallback();
		});

		return customMarker;
	}

	static async fromTypeAndId(type, id, zoom, map) {
		const query = OverpassQuery.generateQueryByTypeAndId(type, id);
		const result = await Ajax.get(OverpassEndpoint.fastestEndpoint + query);

		Marker.setActivePoi(type, id);
		Marker.triggerChangeNotifierCallback();
		const element = result.elements.find(e => parseInt(e.id, 10) === parseInt(id, 10));
		if (!element) throw new Error('Queried element was not found in results');

		const position = Coordinate.getCenterPositionOfOverpassResult(element);
		// Map view update is needed to calculate popup height
		map.setView(position, zoom, { animate: false });

		const newMarker = Marker.createFromOverpassResult(element);
		newMarker.addTo(map).openPopup();

		// Center the marker and the popup
		const positionInPixel = map.project(position);
		const popupHeight = newMarker._popup._container.clientHeight; // eslint-disable-line no-underscore-dangle
		positionInPixel.y -= popupHeight / 2;
		const combinedCenter = map.unproject(positionInPixel);

		map.setView(combinedCenter, zoom, { animate: false });

		return newMarker;
	}
};
