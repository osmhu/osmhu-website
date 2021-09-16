import $ from 'jquery';
import L from 'leaflet';
import log from 'loglevel';

import MobileDetector from '../common/MobileDetector';
import CopyButton from '../common/CopyButton';
import HtmlElement from '../common/HtmlElement';
import OsmElement from '../common/OsmElement';
import OsmElementId from '../common/OsmElementId';
import Coordinate from '../poi/Coordinate';
import Overpass from '../poi/Overpass';
import OsmOrgUrl from '../url/OsmOrgUrl';
import UrlHelper from '../url/UrlHelper';
import UrlParamChangeNotifier from '../url/UrlParamChangeNotifier';
import PopupHtmlCreatorMulti from '../popup/PopupHtmlCreatorMulti';

import IconProvider from './IconProvider';

let activePoi = null;

export default class Marker {
	constructor(osmElementId, leafletMarker) {
		this.osmElementId = osmElementId;
		this.leafletMarker = leafletMarker;
	}

	createPopupFromHtml(popupHtml) {
		this.leafletMarker.bindPopup(popupHtml, {
			offset: L.point(0, -22),
			autoPanPaddingTopLeft: MobileDetector.isMobile() ? [44, 5] : [46, 10],
			autoPanPaddingBottomRight: MobileDetector.isMobile() ? [54, 5] : [56, 10],
		});
	}

	async createPopupFromOverpassResult(overpassResult) {
		const osmElementId = new OsmElementId(overpassResult.type, overpassResult.id);
		const osmElement = new OsmElement(osmElementId, overpassResult.tags);
		const results = await PopupHtmlCreatorMulti.create([osmElement]);

		results.forEach(([markerId, popupHtml]) => { // eslint-disable-line no-unused-vars
			this.createPopupFromHtml(popupHtml);
		});
	}

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

		const osmElementId = new OsmElementId(overpassResult.type, overpassResult.id);
		const iconProvider = new IconProvider(overpassResult.tags);
		try {
			const matchingIcon = iconProvider.getFirstMatchingIcon();
			customMarker.setIcon(matchingIcon);
		} catch (error) {
			customMarker.options.icon.options.popupAnchor = [0, -8];
			log.info('No icon found for', osmElementId.toString(), OsmOrgUrl.browseUrlFromOsmElementId(osmElementId), 'tags were:', overpassResult.tags);
		}

		// On popup open activate copy button
		customMarker.on('popupopen', async () => {
			const copyTarget = await HtmlElement.singleElementFromSelectorWithRetry(`#popup-content-${osmElementId.toObjectPropertyName()} #popup-poi-share-url`);
			CopyButton.copyTargetOnButtonClick(`#popup-content-${osmElementId.toObjectPropertyName()} #popup-poi-copy`, copyTarget);

			Marker.setActivePoi(osmElementId.type, osmElementId.id);
			$(window).trigger('popup-open');
			UrlParamChangeNotifier.trigger();
		});

		customMarker.on('popupclose', () => {
			Marker.removeActivePoi();
			UrlParamChangeNotifier.trigger();
		});

		return new Marker(osmElementId, customMarker);
	}

	static async fromOsmElementId(osmElementId, map) {
		const overpassResult = await Overpass.fetchByOsmElementIdWithRetry(osmElementId);
		Marker.setActivePoi(osmElementId.type, osmElementId.id);
		UrlParamChangeNotifier.trigger();

		const position = Coordinate.getCenterPositionOfOverpassResult(overpassResult);
		const idealZoom = map.getBoundsZoom(Coordinate.getBoundsFromOverpassResult(overpassResult));

		// Map view update is needed to calculate popup height
		map.setView(position, idealZoom, { animate: false });

		const newMarker = Marker.createFromOverpassResult(overpassResult);
		await newMarker.createPopupFromOverpassResult(overpassResult);
		newMarker.leafletMarker.addTo(map).openPopup();

		// Center the marker and the popup
		const positionInPixel = map.project(position);
		// eslint-disable-next-line no-underscore-dangle
		const popupHeight = newMarker.leafletMarker._popup._container.clientHeight;
		positionInPixel.y -= popupHeight / 2;
		const combinedCenter = map.unproject(positionInPixel);

		map.setView(combinedCenter, idealZoom, { animate: false });

		return newMarker;
	}
}
