import L from 'leaflet';

import Ajax from '../common/Ajax';
import OsmElementId from '../common/OsmElementId';
import OverpassQuery from '../poi/OverpassQuery';
import OverpassEndpoint from '../poi/OverpassEndpoint';
import Coordinate from '../poi/Coordinate';
import UrlParamChangeNotifier from '../url/UrlParamChangeNotifier';

import BaseLayers from './BaseLayers';
import Overlays from './Overlays';
import ZoomControl from './controls/ZoomControl';
import LocateControl from './controls/LocateControl';
import ScaleControl from './controls/ScaleControl';
import LoadingIndicatorControl from './controls/LoadingIndicatorControl';
import GeoJsonLayer from './layers/GeoJsonLayer';

L.Icon.Default.imagePath = '/css/images/';

export default class Map {
	constructor(initialView, defaultBaseLayerIdOnLoad, defaultOverlaysOnLoad) {
		this.baseLayers = new BaseLayers();
		this.overlays = new Overlays();

		this.initLeafletMap();
		this.initControls();
		this.initMapView(initialView);
		this.initBaseLayers(defaultBaseLayerIdOnLoad);
		this.initOverlays(defaultOverlaysOnLoad);
	}

	initLeafletMap() {
		const mapContainerHtmlElementId = 'map';

		this.map = L.map(mapContainerHtmlElementId, {
			zoomControl: false,
		});

		this.id = mapContainerHtmlElementId;

		this.map.on('moveend', () => {
			UrlParamChangeNotifier.trigger();
		});
	}

	initControls() {
		this.map.addControl(new ZoomControl().getMapControl());

		this.map.addControl(new LocateControl().getMapControl());

		this.map.addControl(new ScaleControl().getMapControl());

		this.map.addControl(new LoadingIndicatorControl().getMapControl());

		// Create map controls for layers and overlays
		this.map.addControl(L.control.layers(
			this.baseLayers.getTitleLeafletLayerMap(),
			this.overlays.getTitleLeafletLayerMap(),
		));
	}

	initMapView(initialView) {
		// Set the initial view area of the map
		this.map.setView([initialView.lat, initialView.lon], initialView.zoom);
	}

	initBaseLayers(defaultBaseLayerIdOnLoad) {
		// Add initially active base layer to map
		const initialBaseLayerId = defaultBaseLayerIdOnLoad || BaseLayers.defaultId;
		this.baseLayers.getById(initialBaseLayerId).getLeafletLayer().addTo(this.map);
		this.activeBaseLayerId = initialBaseLayerId;

		// On base layer switch, zoom to maxZoom if the new layers maxZoom is exceeded
		this.map.on('baselayerchange', (event) => {
			const currentZoom = this.map.getZoom();
			const newMaxZoom = parseInt(event.layer.options.maxZoom, 10);
			if (currentZoom > newMaxZoom) {
				this.map.setZoom(newMaxZoom);
			}
			this.activeBaseLayerId = event.layer.options.id;
			UrlParamChangeNotifier.trigger();
		});
	}

	initOverlays(defaultOverlaysOnLoad) {
		this.activeOverlayIds = [];

		// When GeoJson layer is added, ensure that it is loaded
		this.map.on('overlayadd', (event) => {
			const overlayId = event.layer.options.id;
			const overlay = this.overlays.getById(overlayId);
			if (overlay instanceof GeoJsonLayer) {
				overlay.ensureLoaded();
			}
			this.activeOverlayIds.push(overlayId);
			UrlParamChangeNotifier.trigger();
		});

		this.map.on('overlayremove', (event) => {
			const overlayIdToRemove = event.layer.options.id;
			this.activeOverlayIds = this.activeOverlayIds.filter(
				(currentOverlayId) => currentOverlayId !== overlayIdToRemove,
			);
			UrlParamChangeNotifier.trigger();
		});

		// Display given overlays on load (must be called after 'overlayadd' listener is added)
		this.overlays.getAllIds().forEach((overlayId) => {
			if (defaultOverlaysOnLoad[overlayId]) {
				this.map.addLayer(this.overlays.getById(overlayId).getLeafletLayer());
			}
		});
	}

	addControl(control) {
		return this.map.addControl(control);
	}

	getCenter() {
		return this.map.getCenter();
	}

	getZoom() {
		return this.map.getZoom();
	}

	getBounds() {
		return this.map.getBounds();
	}

	fitBounds(bounds) {
		return this.map.fitBounds(bounds);
	}

	getBoundsZoom(bounds) {
		return this.map.getBoundsZoom(bounds);
	}

	invalidateSize() {
		return this.map.invalidateSize();
	}

	setView(center, zoom) {
		return this.map.setView(center, zoom);
	}

	addLayer(layer) {
		return this.map.addLayer(layer);
	}

	hasLayer(layer) {
		return this.map.hasLayer(layer);
	}

	removeLayer(layer) {
		return this.map.removeLayer(layer);
	}

	project(position) {
		return this.map.project(position);
	}

	unproject(point) {
		return this.map.unproject(point);
	}

	getId() {
		return this.id;
	}

	getActiveBaseLayerId() {
		return this.activeBaseLayerId;
	}

	getActiveOverlayIds() {
		return this.activeOverlayIds;
	}

	async focusWay(wayId) {
		const query = OverpassQuery.generateQueryByOsmElementId(new OsmElementId('way', wayId));
		const result = await Ajax.get(OverpassEndpoint.fastestEndpoint + query);

		if (result.elements.length === 0) return;

		const way = result.elements.find((element) => parseInt(element.id, 10) === parseInt(wayId, 10));
		if (way) {
			const bounds = Coordinate.getBoundsFromOverpassResult(way);
			if (bounds) {
				this.fitBounds(bounds, { maxZoom: 18 });
			}
		}
	}
}
