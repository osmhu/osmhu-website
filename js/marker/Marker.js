import $ from 'jquery';
import L from 'leaflet';
import log from 'loglevel';

import Ajax from '../common/Ajax';
import MobileDetector from '../common/MobileDetector';
import CopyButton from '../common/CopyButton';
import HtmlElement from '../common/HtmlElement';
import Coordinate from '../poi/Coordinate';
import OverpassQuery from '../poi/OverpassQuery';
import OverpassEndpoint from '../poi/OverpassEndpoint';
import UrlHelper from '../url/UrlHelper';
import UrlParamChangeNotifier from '../url/UrlParamChangeNotifier';
import PopupHtmlCreatorMulti from '../popup/PopupHtmlCreatorMulti';

import IconProvider from './IconProvider';

let activePoi = null;

export default class Marker {
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

	static async createPopupForMarkerSingle(marker, element) {
		const results = await PopupHtmlCreatorMulti.create([element]);

		results.forEach(([markerId, popupHtml]) => { // eslint-disable-line no-unused-vars
			Marker.createPopupForMarker(marker, popupHtml);
		});
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
		await Marker.createPopupForMarkerSingle(newMarker, element);
		newMarker.addTo(map).openPopup();

		// Center the marker and the popup
		const positionInPixel = map.project(position);
		const popupHeight = newMarker._popup._container.clientHeight; // eslint-disable-line no-underscore-dangle
		positionInPixel.y -= popupHeight / 2;
		const combinedCenter = map.unproject(positionInPixel);

		map.setView(combinedCenter, idealZoom, { animate: false });

		return newMarker;
	}
}
