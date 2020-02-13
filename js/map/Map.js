/* globals window */

const L = require('leaflet');

L.Icon.Default.imagePath = '/node_modules/leaflet/dist/images/';

const Ajax = require('../Ajax');

const LocateControl = require('./controls/LocateControl');
const ScaleControl = require('./controls/ScaleControl');
const MarkerCreatorControl = require('./controls/MarkerCreatorControl');
const LoadingIndicatorControl = require('./controls/LoadingIndicatorControl');

const TileLayers = require('./layers/TileLayers');
const Overlays = require('./layers/Overlays');
const GeoJsonLayer = require('../layers/GeoJsonLayer');

const OverpassQuery = require('../poi/OverpassQuery');
const OverpassEndpoint = require('../poi/OverpassEndpoint');
const Coordinate = require('../poi/Coordinate');

const tileLayers = new TileLayers();
const overlays = new Overlays();

module.exports = class Map extends L.Map {
	constructor(initialView, defaultBaseLayerId, defaultOverlaysOnLoad) {
		// Initialize map into #map
		const map = super('map');

		window.map = map; // TODO remove

		map.addControl(new LocateControl().getMapControl());

		map.addControl(new ScaleControl().getMapControl());

		map.addControl(new MarkerCreatorControl().getMapControl());

		map.addControl(new LoadingIndicatorControl().getMapControl());

		// Create map controls for layers and overlays
		map.addControl(L.control.layers(tileLayers.getLeafletLayersByDisplayName(),
			overlays.getLeafletLayersByDisplayName()));

		// Add initially active base layer to map
		const initialBaseLayerId = defaultBaseLayerId || 'M'; // Mapnik if not defined
		tileLayers.getById(initialBaseLayerId).getLayer().addTo(map);
		this.activeBaseLayerId = initialBaseLayerId;

		// Set the initial view area of the map
		map.setView([initialView.lat, initialView.lon], initialView.zoom);

		map.on('moveend', () => {
			this.triggerChangeNotifier();
		});

		// On base layer switch, zoom to maxZoom if the new layers maxZoom is exceeded
		map.on('baselayerchange', (event) => {
			const currentZoom = map.getZoom();
			const newMaxZoom = parseInt(event.layer.options.maxZoom, 10);
			if (currentZoom > newMaxZoom) {
				map.setZoom(newMaxZoom);
			}
			this.activeBaseLayerId = event.layer.options.id;
			this.triggerChangeNotifier();
		});

		this.activeOverlayIds = [];

		// When GeoJson layer is added, ensure that it is loaded
		map.on('overlayadd', (event) => {
			const overlayId = event.layer.options.id;
			const overlay = overlays.getById(overlayId);
			if (overlay instanceof GeoJsonLayer) {
				overlay.ensureLoaded();
			}
			this.activeOverlayIds.push(overlayId);
			this.triggerChangeNotifier();
		});

		map.on('overlayremove', (event) => {
			const overlayId = event.layer.options.id;
			for (let i = this.activeOverlayIds.length; i >= 0; i--) {
				if (this.activeOverlayIds[i] === overlayId) {
					this.activeOverlayIds.splice(i, 1);
				}
			}
			this.triggerChangeNotifier();
		});

		// Display given overlays on load (must be called after 'overlayadd' listener is added)
		overlays.getAllIds().forEach((id) => {
			if (defaultOverlaysOnLoad[id]) {
				map.addLayer(overlays.getById(id).getLayer());
			}
		});
	}

	getActiveBaseLayerId() {
		return this.activeBaseLayerId;
	}

	getActiveOverlayIds() {
		return this.activeOverlayIds;
	}

	setChangeNotifierCallback(callback) {
		this.changeNotifierCallback = callback;
	}

	triggerChangeNotifier() {
		if (this.changeNotifierCallback) {
			this.changeNotifierCallback();
		}
	}

	async focusWay(wayId) {
		const query = OverpassQuery.generateQueryByTypeAndId('way', wayId);
		const result = await Ajax.get(OverpassEndpoint.fastestEndpoint + query);

		if (result.elements.length === 0) return;

		const way = result.elements.find(element => parseInt(element.id, 10) === parseInt(wayId, 10));
		const bounds = Coordinate.getBoundsFromOverpassResult(way);
		if (bounds) {
			this.fitBounds(bounds, { maxZoom: 18 });
		}
	}
};
