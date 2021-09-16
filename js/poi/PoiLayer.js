import L from 'leaflet';

import LoadingIndicator from '../common/LoadingIndicator';
import OsmElement from '../common/OsmElement';
import OsmElementId from '../common/OsmElementId';
import Marker from '../marker/Marker';
import Markers from '../marker/Markers';
import PopupHtmlCreatorMulti from '../popup/PopupHtmlCreatorMulti';
import PopupHtmlStore from '../popup/PopupHtmlStore';

import OverpassQuery from './OverpassQuery';
import OverpassEndpoint from './OverpassEndpoint';
import PoiSearchHierarchy from './PoiSearchHierarchy';

// Creates L.OverPassLayer class
import 'leaflet-overpass-layer/dist/OverPassLayer.bundle';

// Creates L.markerClusterGroup function
import 'leaflet.markercluster/dist/leaflet.markercluster';

const minZoomForPoiLayer = 15;

export default class PoiLayer {
	constructor(layerId, map) {
		this.layerId = layerId;
		this.map = map;
		this.popupHtmlStore = new PopupHtmlStore();

		this.markerGroup = L.markerClusterGroup({
			showCoverageOnHover: false,
			maxClusterRadius: 26,
		});
		this.map.addLayer(this.markerGroup);
		this.overpassLayer = this.createOverpassLayer(layerId);
		this.map.addLayer(this.overpassLayer);

		if (this.map.getZoom() >= minZoomForPoiLayer) {
			LoadingIndicator.show();
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

	createOverpassLayer(layerId) {
		const criteria = PoiSearchHierarchy.getOverpassQueryById(layerId);
		const overpassQuery = OverpassQuery.generateQuery(criteria);
		if (!overpassQuery) {
			throw new Error('Could not generate overpass query for criteria ' + criteria + ' for poi layer id: ' + layerId);
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
			retryOnTimeout: true,
			beforeRequest: () => LoadingIndicator.show(),
			onError: () => {
				this.map.removeLayer(this.overpassLayer);
				this.map.addLayer(this.overpassLayer);
			},
			onSuccess: (data) => this.displayOverpassResultsOnMap(data.elements),
		});
	}

	async displayOverpassResultsOnMap(overpassResults) {
		const markers = new Markers();
		const osmElementsForPopupCreation = [];

		Object.values(overpassResults).forEach((overpassResult) => {
			const osmElementId = new OsmElementId(overpassResult.type, overpassResult.id);

			const noMarkerYet = !this.popupHtmlStore.hasId(osmElementId);
			if (noMarkerYet && overpassResult.tags
				&& (overpassResult.tags.amenity || overpassResult.tags.shop
					|| overpassResult.tags.leisure || overpassResult.tags.tourism
					|| overpassResult.tags.natural) && overpassResult.tags.amenity !== 'parking_entrance'
			) {
				const marker = Marker.createFromOverpassResult(overpassResult);
				markers.add(marker);

				const osmElement = new OsmElement(osmElementId, overpassResult.tags);
				osmElementsForPopupCreation.push(osmElement);
			}
		});

		const results = await PopupHtmlCreatorMulti.create(osmElementsForPopupCreation);

		results.forEach(([osmElementIdObjectPropertyName, popupHtml]) => {
			const osmElementId = OsmElementId.fromObjectPropertyName(osmElementIdObjectPropertyName);
			const marker = markers.getByOsmElementId(osmElementId);
			if (marker) {
				marker.createPopupFromHtml(popupHtml);
				this.popupHtmlStore.add(marker.osmElementId, popupHtml);
			}
		});

		this.markerGroup.addLayers(markers.getAllLeafletMarkers());

		LoadingIndicator.hide();
	}
}
