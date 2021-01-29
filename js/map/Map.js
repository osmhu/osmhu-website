import L from 'leaflet';

import Ajax from '../common/Ajax';
import OverpassQuery from '../poi/OverpassQuery';
import OverpassEndpoint from '../poi/OverpassEndpoint';
import Coordinate from '../poi/Coordinate';
import UrlParamChangeNotifier from '../url/UrlParamChangeNotifier';

import ZoomControl from './controls/ZoomControl';
import LocateControl from './controls/LocateControl';
import ScaleControl from './controls/ScaleControl';
import LoadingIndicatorControl from './controls/LoadingIndicatorControl';
import TileLayers from './layers/TileLayers';
import Overlays from './layers/Overlays';
import GeoJsonLayer from './layers/GeoJsonLayer';

L.Icon.Default.imagePath = '/node_modules/leaflet/dist/images/';

const tileLayers = new TileLayers();
const overlays = new Overlays();

export default class Map extends L.Map {
	constructor(initialView, defaultBaseLayerId, defaultOverlaysOnLoad) {
		const mapContainerHtmlElementId = 'map';

		const map = super(mapContainerHtmlElementId, {
			zoomControl: false,
		});

		this.id = mapContainerHtmlElementId;
		this.initializeLeafletMap(map, initialView, defaultBaseLayerId, defaultOverlaysOnLoad);
	}

	initializeLeafletMap(map, initialView, defaultBaseLayerId, defaultOverlaysOnLoad) {
		map.addControl(new ZoomControl().getMapControl());

		map.addControl(new LocateControl().getMapControl());

		map.addControl(new ScaleControl().getMapControl());

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
			UrlParamChangeNotifier.trigger();
		});

		// On base layer switch, zoom to maxZoom if the new layers maxZoom is exceeded
		map.on('baselayerchange', (event) => {
			const currentZoom = map.getZoom();
			const newMaxZoom = parseInt(event.layer.options.maxZoom, 10);
			if (currentZoom > newMaxZoom) {
				map.setZoom(newMaxZoom);
			}
			this.activeBaseLayerId = event.layer.options.id;
			UrlParamChangeNotifier.trigger();
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
			UrlParamChangeNotifier.trigger();
		});

		map.on('overlayremove', (event) => {
			const overlayId = event.layer.options.id;
			for (let i = this.activeOverlayIds.length; i >= 0; i--) {
				if (this.activeOverlayIds[i] === overlayId) {
					this.activeOverlayIds.splice(i, 1);
				}
			}
			UrlParamChangeNotifier.trigger();
		});

		// Display given overlays on load (must be called after 'overlayadd' listener is added)
		overlays.getAllIds().forEach((overlayId) => {
			if (defaultOverlaysOnLoad[overlayId]) {
				map.addLayer(overlays.getById(overlayId).getLayer());
			}
		});
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
		const query = OverpassQuery.generateQueryByTypeAndId('way', wayId);
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
