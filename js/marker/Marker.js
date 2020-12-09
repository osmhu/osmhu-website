/* globals window */

const $ = require('jquery');
const L = require('leaflet');
const log = require('loglevel');

const MobileDetector = require('../common/MobileDetector');
const CopyButton = require('../common/CopyButton');
const HtmlElement = require('../common/HtmlElement');
const Coordinate = require('../poi/Coordinate');
const OverpassQuery = require('../poi/OverpassQuery');
const OverpassEndpoint = require('../poi/OverpassEndpoint');
const Ajax = require('../common/Ajax');
const UrlHelper = require('../url/UrlHelper');
const UrlParamChangeNotifier = require('../url/UrlParamChangeNotifier');
const PopupHtmlCreator = require('../popup/PopupHtmlCreator');

const IconProvider = require('./IconProvider');

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
			const matchingIcon = iconProvider.getFirstMatchingIcon();
			customMarker.setIcon(matchingIcon);
		} catch (error) {
			customMarker.options.icon.options.popupAnchor = [0, -8];
			log.info('No icon found for', overpassResult.type, overpassResult.id, 'tags were:', overpassResult.tags);
		}

		// On popup open activate copy button
		customMarker.on('popupopen', () => {
			const copyTarget = HtmlElement.singleElementFromSelector(`#popup-content-${overpassResult.type}-${overpassResult.id} #popup-poi-share-url`);
			CopyButton.copyTargetOnButtonClick(`#popup-content-${overpassResult.type}-${overpassResult.id} #popup-poi-copy`, copyTarget);

			Marker.setActivePoi(overpassResult.type, overpassResult.id);
			$(window).trigger('popup-open');
			UrlParamChangeNotifier.trigger();
		});

		customMarker.on('popupclose', () => {
			Marker.removeActivePoi();
			UrlParamChangeNotifier.trigger();
		});

		return customMarker;
	}

	static createPopupForMarkerSync(marker, overpassResult) {
		const popupHtml = PopupHtmlCreator.generateHtml(overpassResult);

		Marker.createPopupForMarker(marker, popupHtml);
	}

	static createPopupForMarker(marker, popupHtml) {
		marker.bindPopup(popupHtml, {
			offset: L.point(0, -22),
			autoPanPaddingTopLeft: MobileDetector.isMobile() ? [44, 5] : [46, 10],
			autoPanPaddingBottomRight: MobileDetector.isMobile() ? [54, 5] : [56, 10],
		});
	}

	static async fromTypeAndId(type, id, map) {
		const query = OverpassQuery.generateQueryByTypeAndId(type, id);
		const result = await Ajax.get(OverpassEndpoint.fastestEndpoint + query);

		Marker.setActivePoi(type, id);
		UrlParamChangeNotifier.trigger();
		const element = result.elements.find((e) => parseInt(e.id, 10) === parseInt(id, 10));
		if (!element) throw new Error('Queried element was not found in results');

		const position = Coordinate.getCenterPositionOfOverpassResult(element);
		const idealZoom = map.getBoundsZoom(Coordinate.getBoundsFromOverpassResult(element));

		// Map view update is needed to calculate popup height
		map.setView(position, idealZoom, { animate: false });

		const newMarker = Marker.createFromOverpassResult(element);
		Marker.createPopupForMarkerSync(newMarker, element);
		newMarker.addTo(map).openPopup();

		// Center the marker and the popup
		const positionInPixel = map.project(position);
		const popupHeight = newMarker._popup._container.clientHeight; // eslint-disable-line no-underscore-dangle
		positionInPixel.y -= popupHeight / 2;
		const combinedCenter = map.unproject(positionInPixel);

		map.setView(combinedCenter, idealZoom, { animate: false });

		return newMarker;
	}
};
