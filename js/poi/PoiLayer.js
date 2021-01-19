import L from 'leaflet';

import PopupHtmlCreatorMulti from '../popup/PopupHtmlCreatorMulti';
import Marker from '../marker/Marker';

import OverpassQuery from './OverpassQuery';
import OverpassEndpoint from './OverpassEndpoint';
import PoiSearchHierarchy from './PoiSearchHierarchy';

// Creates L.OverPassLayer class
import 'leaflet-overpass-layer/dist/OverPassLayer.bundle';

// Creates L.markerClusterGroup function
import 'leaflet.markercluster/dist/leaflet.markercluster';

const minZoomForPoiLayer = 15;

export default class PoiLayer {
	constructor(map, searchId, onLoadingStateChangedFunction) {
		this.map = map;
		this.searchId = searchId;
		this.onLoadingStateChanged = onLoadingStateChangedFunction;

		this.markerGroup = L.markerClusterGroup({
			showCoverageOnHover: false,
			maxClusterRadius: 26,
		});
		this.map.addLayer(this.markerGroup);
		this.overpassLayer = this.createOverpassLayer(searchId);
		this.map.addLayer(this.overpassLayer);
		this.idsWithMarker = [];

		if (this.map.getZoom() >= minZoomForPoiLayer) {
			this.onLoadingStateChanged(true);
		}
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
	}

	createOverpassLayer(searchId) {
		const criteria = PoiSearchHierarchy.getOverpassQueryById(searchId);
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
				minZoomMessage: '<img src="/kepek/1391811435_Warning.png" alt="Figyelem" width="20" height="20">A helyek a MINZOOMLEVEL. nagyítási szinttől jelennek meg. (Jelenleg: CURRENTZOOM)',
			},
			beforeRequest: () => this.onLoadingStateChanged(true),
			onError: () => this.onLoadingStateChanged(false),
			onSuccess: (data) => this.displayOverpassResultsOnMap(data.elements),
		});
	}

	async displayOverpassResultsOnMap(overpassResults) {
		const markers = {};
		const overpassResultsForPopupCreation = [];

		Object.values(overpassResults).forEach((overpassResult) => {
			const noMarkerYet = this.idsWithMarker.indexOf('' + overpassResult.id) === -1;
			if (noMarkerYet && overpassResult.tags
				&& (overpassResult.tags.amenity || overpassResult.tags.shop
					|| overpassResult.tags.leisure || overpassResult.tags.tourism
					|| overpassResult.tags.natural) && overpassResult.tags.amenity !== 'parking_entrance'
			) {
				const marker = Marker.createFromOverpassResult(overpassResult);
				markers[overpassResult.id] = marker;
				overpassResultsForPopupCreation.push(overpassResult);
			}
		});

		const results = await PopupHtmlCreatorMulti.create(overpassResultsForPopupCreation);

		results.forEach(([markerId, popupHtml]) => {
			const marker = markers[markerId];
			if (marker) {
				Marker.createPopupForMarker(marker, popupHtml);
			}
		});

		// Add new marker ids
		this.idsWithMarker = this.idsWithMarker.concat(Object.keys(markers));

		const layers = Object.values(markers);
		this.markerGroup.addLayers(layers);

		this.onLoadingStateChanged(false);
	}
}
