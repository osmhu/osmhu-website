var L = require('leaflet');
L.Icon.Default.imagePath = '/node_modules/leaflet/dist/images/';
require('leaflet.locatecontrol'); // Creates L.control.locate function

var config = require('./config/leaflet');
var layers = require('./config/layers');
var overlays = require('./config/overlays');
var share = require('./share');
var markerCreator = require('./controls/markerCreator');
var LoadingIndicator = require('./controls/loadingIndicator');

// Available layers
var layerControls = {
	'Mapnik (Alapértelmezett)': layers.mapnik,
	'Kerékpáros térkép':        layers.cycleMap,
	'Mapquest térkép':          layers.mapquest,
	'Tömegközlekedés':          layers.transport,
	'Humanitárius':             layers.humanitarian
};

// Available overlays
var overlayControls = {
	'Turistautak':           overlays.tourist,
	'Országos Kéktúra':      overlays.okt,
	'Dél-Dunántúli Kéktúra': overlays.ddk,
	'Alföldi Kéktúra':       overlays.akt
};


module.exports = {
	initialize: function (options) {
		var url = options.url;

		// Initialize map into #map
		window.map = L.map('map');

		// Add Leaflet.Locate control to map
		L.control.locate(config.locate).addTo(map);

		// Add scale control to map
		L.control.scale(config.scale).addTo(map);

		// Add markerCreator control to map
		markerCreator.initialize({
			onClick: share.toggle
		}).addTo(map);

		// Add loadingIndicator to map
		var loadingIndicator = new LoadingIndicator;
		loadingIndicator.addTo(map);

		// Add reportError control to map
		//L.control.reportError().addTo(map);

		// Create map controls for layers and overlays
		L.control.layers(layerControls, overlayControls).addTo(map);

		// Add default layer to map
		layers.getById(options.layer).addTo(map);
		url.setBaseLayer(options.layer);

		// Set the view of the map
		map.setView([ options.view.lat, options.view.lon ], options.view.zoom);

		// On map move end, update the url
		map.on('moveend', function () {
			$(window).trigger('updateUrl');
		});

		// On base layer switch, zoom out if the zoom is greater than the new layers maxZoom and update url
		map.on('baselayerchange', function (event) {
			var currentZoom = map.getZoom();
			var newMaxZoom = parseInt(event.layer.options.maxZoom);
			if (currentZoom > newMaxZoom) {
				map.setZoom(newMaxZoom);
			}
			// Update page url
			url.setBaseLayer(event.layer.options.layerId);
			$(window).trigger('updateUrl');
		});

		// Ensure on overlay add, that the GeoJson data is loaded and update the url
		map.on('overlayadd', function (event) {
			var overlayId = event.layer.options.layerId;
			overlays.ensureGeoJsonLoaded(overlayId);
			url.addOverlay(overlayId);
		});

		// Update the url, when an overlay is removed
		map.on('overlayremove', function (event) {
			url.removeOverlay(event.layer.options.layerId);
		});

		// Display given overlays on load (must be called after 'overlayadd' listener is added)
		if (options.overlays.tur) map.addLayer(overlays.tourist);
		if (options.overlays.okt) map.addLayer(overlays.okt);
		if (options.overlays.ddk) map.addLayer(overlays.ddk);
		if (options.overlays.akt) map.addLayer(overlays.akt);

		return map;
	}
};
