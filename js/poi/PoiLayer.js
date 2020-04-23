const L = require('leaflet');

// Creates L.OverPassLayer class
require('leaflet-overpass-layer/dist/OverPassLayer.bundle'); // eslint-disable-line import/no-unassigned-import

// Creates L.markerClusterGroup function
require('leaflet.markercluster/dist/leaflet.markercluster'); // eslint-disable-line import/no-unassigned-import

const MobileDetector = require('../MobileDetector');
const Marker = require('../marker/Marker');
const OverpassQuery = require('./OverpassQuery');
const OverpassEndpoint = require('./OverpassEndpoint');
const UrlParamChangeNotifier = require('../url/UrlParamChangeNotifier');
const PopupHtmlCreatorAsync = require('../popup/PopupHtmlCreatorAsync');
const LoadingIndicator = require('../map/LoadingIndicator');

const poiSearchHierarchyData = require('./poiSearchHierarchyData');
const PoiSearchHierarchyTraversal = require('./PoiSearchHierarchyTraversal');

const poiSearchHierarchy = new PoiSearchHierarchyTraversal(poiSearchHierarchyData);

const minZoomForPoiLayer = 15;

let activePoiLayer = null;

module.exports = class PoiLayer {
	constructor(map, searchId) {
		this.map = map;
		this.searchId = searchId;
		this.markerGroup = L.markerClusterGroup({
			showCoverageOnHover: false,
			maxClusterRadius: 26,
		});
		this.map.addLayer(this.markerGroup);
		this.overpassLayer = this.createOverpassLayer(searchId);
		this.map.addLayer(this.overpassLayer);
		this.idsWithMarker = [];
		if (this.map.getZoom() >= minZoomForPoiLayer) {
			LoadingIndicator.setLoading(true);
		}
	}

	static displayPoiLayer(map, searchId) {
		if (searchId.length === 0) return;

		if (activePoiLayer) {
			activePoiLayer.remove();
		}

		activePoiLayer = new PoiLayer(map, searchId);
		UrlParamChangeNotifier.trigger();
	}

	remove() {
		if (typeof this.overpassLayer !== 'undefined') {
			// OverpassLayer does not itself remove MinZoomIndicator during remove
			if (this.overpassLayer._zoomControl) { // eslint-disable-line no-underscore-dangle
				try {
					this.map.removeControl(this.overpassLayer._zoomControl); // eslint-disable-line no-underscore-dangle
				} catch (error) {
					// no problem, remove throws an error
				}
				this.map.zoomIndicator = null; // New zoom indicator is created by next instance
			}

			this.map.removeLayer(this.overpassLayer);
		}

		if (this.markerGroup) {
			this.map.removeLayer(this.markerGroup);
		}

		activePoiLayer = null;
	}

	static getActivePoiLayerSearchId() {
		if (!(activePoiLayer instanceof PoiLayer)) {
			throw new Error('No active poi layer');
		}
		return activePoiLayer.searchId;
	}

	static destroyActive() {
		if (activePoiLayer) {
			activePoiLayer.remove();
			UrlParamChangeNotifier.trigger();
		}
	}

	createOverpassLayer(searchId) {
		const criteria = poiSearchHierarchy.getOverpassQueryById(searchId);
		const overpassQuery = OverpassQuery.generateQuery(criteria);
		if (!overpassQuery) {
			throw new Error('Could not generate overpass query for criteria ' + criteria + ' for search id: ' + searchId);
		}

		return new L.OverPassLayer({
			minZoom: minZoomForPoiLayer,
			endPoint: OverpassEndpoint.fastestEndpoint,
			query: overpassQuery,
			minZoomIndicatorOptions: {
				position: 'topleft',
				minZoomMessageNoLayer: 'Nincs réteg hozzáadva.',
				minZoomMessage: '<img src="/kepek/1391811435_Warning.png">A helyek a MINZOOMLEVEL. nagyítási szinttől jelennek meg. (Jelenleg: CURRENTZOOM)',
			},
			beforeRequest: () => LoadingIndicator.setLoading(true),
			onError: () => LoadingIndicator.setLoading(false),
			onSuccess: data => this.displayOverpassResultsOnMap(data.elements),
		});
	}

	displayOverpassResultsOnMap(overpassResults) {
		const markers = {};
		const overpassResultsForPopupCreation = [];

		Object.values(overpassResults).forEach((overpassResult) => {
			const noMarkerYet = this.idsWithMarker.indexOf('' + overpassResult.id) === -1;
			if (noMarkerYet && overpassResult.tags
				&& (overpassResult.tags.amenity || overpassResult.tags.shop
					|| overpassResult.tags.leisure || overpassResult.tags.tourism
					|| overpassResult.tags.natural) && overpassResult.tags.amenity !== 'parking_entrance') {
				const marker = Marker.createFromOverpassResult(overpassResult);
				markers[overpassResult.id] = marker;
				overpassResultsForPopupCreation.push(overpassResult);
			}
		});

		PopupHtmlCreatorAsync.create(overpassResultsForPopupCreation, (results) => {
			results.forEach(([markerId, popupHtml]) => {
				const marker = markers[markerId];
				if (marker) {
					// Add popup to show poi information on marker click
					marker.bindPopup(popupHtml, {
						offset: L.point(0, 4),
						autoPanPaddingTopLeft: MobileDetector.isMobile() ? [44, 5] : [46, 10],
						autoPanPaddingBottomRight: MobileDetector.isMobile() ? [54, 5] : [56, 10],
					});
				}
			});
		});

		// Add new marker ids
		this.idsWithMarker = this.idsWithMarker.concat(Object.keys(markers));

		const layers = Object.values(markers);
		this.markerGroup.addLayers(layers);

		LoadingIndicator.setLoading(false);
	}
};
