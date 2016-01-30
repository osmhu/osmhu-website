var $ = require('jquery');
var L = require('leaflet');
L.Icon.Default.imagePath = 'leaflet/images/';

var EmbedCreator = require('./embed-creator');
var Nominatim = require('./nominatim');
var layers = require('./layers');

var activeBaseLayer = 'Q'; // Currently active base layer

function setBaseLayer (layerId) {
    activeBaseLayer = layerId;
};

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

var map = L.map('choose-map', { zoomControl: false });

// Add scale control to map
L.control.scale(scaleControlConfig).addTo(map);

// Create map controls for layers
L.control.layers(layerControls).addTo(map);

var defaultLayer = layers.getById('Q');
defaultLayer.addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

map.setView([ 47.17, 19.49 ], 6);

map.on('baselayerchange', function (event) {
	setBaseLayer(event.layer.options.layerId);
});

var waitingToSearch = false;
var activeTimeout;

$('#create-form #address').keyup(function () {
	var address = $('#address').val();

	if (waitingToSearch) {
		clearTimeout(activeTimeout);
	};

	waitingToSearch = true;
	activeTimeout = setTimeout(function () {
		waitingToSearch = false;
		$('#address').addClass('searching');
		Nominatim.search(address, map, createMarker);
		refreshInfo();
	}, 1000);
});

function refreshInfo () {
	var title = $('#name').val();
	$('#overlay-info p.title').html(title);

	var address = $('#address').val();
	$('#overlay-info p.address').html(address);
}

$('#create-form .form-control').blur(function () {
	refreshInfo();

	EmbedCreator.preview(activeMarker, map, activeBaseLayer);
});

$('#create-form').submit(function (event) {
	event.preventDefault();

	refreshInfo();

	EmbedCreator.preview(activeMarker, map, activeBaseLayer);

	$('#html-preview').select();
});

$('#html-preview').on('click', function () {
	EmbedCreator.preview(activeMarker, map, activeBaseLayer);

	$(this).select();
});

var redIcon = L.icon({
	iconUrl: 'http://www.openstreetmap.hu/kepek/marker-icon-red.png',
	iconAnchor: [ 13, 40 ]
});

var activeMarker;
function createMarker (lat, lon) {
	if (activeMarker) {
		map.removeLayer(activeMarker);
	}
	activeMarker = new L.Marker([lat, lon], { icon: redIcon, draggable: true });
	map.addLayer(activeMarker);
}

$('#search-results').click('.result', function (event) {
	var $result = $(event.target);
	var boundingBox0 = $result.attr('data-boundingbox-0');
	var boundingBox1 = $result.attr('data-boundingbox-1');
	var boundingBox2 = $result.attr('data-boundingbox-2');
	var boundingBox3 = $result.attr('data-boundingbox-3');
	var lat = $result.attr('data-lat');
	var lon = $result.attr('data-lon');

	createMarker(lat, lon);

	var boundingBox = [
		[boundingBox0, boundingBox2],
		[boundingBox1, boundingBox3]
	];

	map.fitBounds(boundingBox);
});
