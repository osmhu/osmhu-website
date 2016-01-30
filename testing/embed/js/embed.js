var $ = require('jquery');
var L = require('leaflet');
L.Icon.Default.imagePath = 'leaflet/images/';

var queryString = require('query-string');
var params = queryString.parse(location.search);

var layers = require('./layers');

// Available layers
var layerControls = {
	'Mapnik (Alapértelmezett)': layers.mapnik,
	'Kerékpáros térkép':        layers.cycleMap,
	'Mapquest térkép':          layers.mapquest,
	'Tömegközlekedés':          layers.transport,
	'Humanitárius':             layers.humanitarian
};

var scaleControlConfig = {
	maxWidth: 200,
	imperial: false
};

// Initialize map into #map
var map = L.map('map', { zoomControl: false });

// Add scale control to map
L.control.scale(scaleControlConfig).addTo(map);

// Create map controls for layers
L.control.layers(layerControls).addTo(map);

// Add default layer to map
var defaultLayer = layers.getById(params.layer);
defaultLayer.addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

var lat = params.lat || 47.17;
var lon = params.lon || 19.49;
var zoom = params.zoom || 7;

map.setView([ lat, lon ], zoom);

$('#overlay-info p.title').html(params.name);
$('#overlay-info p.address').html(params.address);

var redIcon = L.icon({
	iconUrl: 'http://www.openstreetmap.hu/kepek/marker-icon-red.png',
	iconAnchor: [ 13, 40 ]
});

// Create a red marker at [ lat, lon ]
var redMarker = new L.marker([ lat, lon ], {
	icon: redIcon
});

// Add to map
redMarker.addTo(map);

// Open popup
var html = '<div class="popup-loaded-marker">';
	html+= '<p class="title">' + params.name + '</p>';
    html+= '<p class="address">' + params.address + '</p>';
    html+= '</div>';
redMarker.bindPopup(html, {
	offset: new L.point(0, -28)
});

var positionInPixel = map.project([ lat, lon ], zoom);
positionInPixel.y -= 70;
var combinedCenter = map.unproject(positionInPixel);

map.setView(combinedCenter, zoom, { animate: false });
