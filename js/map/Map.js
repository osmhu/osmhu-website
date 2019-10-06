/* globals window */

const L = require('leaflet');

L.Icon.Default.imagePath = '/node_modules/leaflet/dist/images/';

const LocateControl = require('./controls/LocateControl');
const ScaleControl = require('./controls/ScaleControl');
const MarkerCreatorControl = require('./controls/MarkerCreatorControl');
const LoadingIndicatorControl = require('./controls/LoadingIndicatorControl');

const TileLayers = require('./layers/TileLayers');
const Overlays = require('./layers/Overlays');
const GeoJsonLayer = require('../layers/GeoJsonLayer');

const overpass = require('../overpass');

const tileLayers = new TileLayers();
const overlays = new Overlays();

module.exports = class Map extends L.Map {
	constructor(url, view, activeLayer, activeOverlays) {
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

		// Add initially active layer to map
		const initialLayer = activeLayer || 'M'; // Mapnik if not defined
		tileLayers.getById(initialLayer).getLayer().addTo(map);
		url.setBaseLayer(initialLayer);

		// Set the initial view area of the map
		map.setView([view.lat, view.lon], view.zoom);

		map.on('moveend', () => {
			url.update();
		});

		// On base layer switch, zoom to maxZoom if the new layers maxZoom is exceeded and update url
		map.on('baselayerchange', (event) => {
			const currentZoom = map.getZoom();
			const newMaxZoom = parseInt(event.layer.options.maxZoom, 10);
			if (currentZoom > newMaxZoom) {
				map.setZoom(newMaxZoom);
			}
			// Update page url
			url.setBaseLayer(event.layer.options.id);
			url.update();
		});

		// When GeoJson layer is added, ensure that it is loaded and update the url
		map.on('overlayadd', (event) => {
			const overlayId = event.layer.options.id;
			const overlay = overlays.getById(overlayId);
			if (overlay instanceof GeoJsonLayer) {
				overlay.ensureLoaded();
				url.addOverlay(overlayId);
			}
		});

		// Update the url, when an overlay is removed
		map.on('overlayremove', (event) => {
			url.removeOverlay(event.layer.options.id);
		});

		// Display given overlays on load (must be called after 'overlayadd' listener is added)
		overlays.getAllIds().forEach((id) => {
			if (activeOverlays[id]) {
				map.addLayer(overlays.getById(id).getLayer());
			}
		});
	}

	async focusWay(wayId) {
		const wayAndContainedNodes = await overpass.getDetailsByTypeAndId('way', wayId);

		if (wayAndContainedNodes.elements.length === 0) return;

		const way = overpass.findElementById(wayId, wayAndContainedNodes.elements);
		const position = overpass.getElementLocationFromResults(way, wayAndContainedNodes.elements);
		if (position) {
			this.fitBounds(position.bounds, { maxZoom: 18 });
		}
	}
};
