const L = require('leaflet');

// Creates L.OverPassLayer class
require('leaflet-overpass-layer/dist/OverPassLayer.bundle'); // eslint-disable-line import/no-unassigned-import

// Creates L.markerClusterGroup function
require('leaflet.markercluster/dist/leaflet.markercluster'); // eslint-disable-line import/no-unassigned-import

const Marker = require('../marker/Marker');
const OverpassQuery = require('./OverpassQuery');
const OverpassEndpoint = require('./OverpassEndpoint');

const poiSearchHierarchyData = require('./poiSearchHierarchyData');
const PoiSearchHierarchyTraversal = require('./PoiSearchHierarchyTraversal');

const poiSearchHierarchy = new PoiSearchHierarchyTraversal(poiSearchHierarchyData);

let activePoiLayer = null;
let poiLayerLoading = false;

let changeNotifierCallback = null;

const triggerChangeNotifierCallback = () => {
	if (changeNotifierCallback) {
		changeNotifierCallback();
	}
};

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
		poiLayerLoading = true;
	}

	static displayPoiLayer(map, searchId) {
		if (searchId.length === 0) return;

		if (poiLayerLoading === true) {
			throw new Error('Another poi layer is already loading');
		}

		if (activePoiLayer) {
			activePoiLayer.remove();
		}

		activePoiLayer = new PoiLayer(map, searchId);
		triggerChangeNotifierCallback();
	}

	static setChangeNotifierCallback(callback) {
		changeNotifierCallback = callback;
	}

	remove() {
		if (typeof this.overpassLayer !== 'undefined') {
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
		if (activePoiLayer && !poiLayerLoading) {
			activePoiLayer.remove();
			triggerChangeNotifierCallback();
		}
	}

	createOverpassLayer(searchId) {
		const criteria = poiSearchHierarchy.getOverpassQueryById(searchId);
		const overpassQuery = OverpassQuery.generateQuery(criteria);
		if (!overpassQuery) {
			throw new Error('Could not generate overpass query for criteria ' + criteria + ' for search id: ' + searchId);
		}

		return new L.OverPassLayer({
			minZoom: 15,
			endPoint: OverpassEndpoint.fastestEndpoint,
			query: overpassQuery,
			minZoomIndicatorOptions: {
				position: 'topleft',
				minZoomMessageNoLayer: 'Nincs réteg hozzáadva.',
				minZoomMessage: '<img src="/kepek/1391811435_Warning.png">A helyek a MINZOOMLEVEL. nagyítási szinttől jelennek meg. (Jelenleg: CURRENTZOOM)',
			},
			onSuccess: data => this.displayOverpassResultsOnMap(data.elements),
		});
	}

	displayOverpassResultsOnMap(overpassResults) {
		const markers = [];

		Object.values(overpassResults).forEach((overpassResult) => {
			if (overpassResult.tags
				&& (overpassResult.tags.amenity || overpassResult.tags.shop
					|| overpassResult.tags.leisure || overpassResult.tags.tourism
					|| overpassResult.tags.natural) && overpassResult.tags.amenity !== 'parking_entrance') {
				markers.push(Marker.createFromOverpassResult(overpassResult));
			}
		});

		this.markerGroup.addLayers(markers);

		poiLayerLoading = false;
	}
};
