/* globals window, document */

require('@babel/polyfill');

const $ = require('jquery');

// Parse params
var queryString = require('query-string');
var params = queryString.parse(location.search);

const MobileDetector = require('./MobileDetector');
const search = require('./search');
const DirectionsApi = require('./directions/DirectionsApi');
const DirectionsControl = require('./directions/DirectionsControl');
const DirectionsResultLayer = require('./directions/DirectionsResultLayer');
const Marker = require('./marker/Marker');
var introduction = require('./introduction');

const OverpassEndpoint = require('./poi/OverpassEndpoint');
const PoiLayer = require('./poi/PoiLayer');

// Initializes all autocomplete fields
const Autocomplete = require('./search/Autocomplete');

const Url = require('./url/Url');

const share = require('./share');

var select2 = require('./select2');
var promotion = require('./promotion');
const Map = require('./map/Map');

params.zoom = params.zoom || params.mzoom; // Backwards compatibility with old mzoom url's

// Default center and zoom of Hungary
var lat = 47.17;
var lon = 19.49;
var zoom = 7;

// If the url params define a marker
var markerDefined = params.zoom && params.mlat && params.mlon;
if (markerDefined) {
	lat = params.mlat;
	lon = params.mlon;
	zoom = params.zoom;
// If the url params define a position
} else if (params.zoom && params.lat && params.lon) {
	lat = params.lat;
	lon = params.lon;
	zoom = params.zoom;
}

const map = new Map({
		lat:   lat,
		lon:   lon,
		zoom:  zoom,
	},
	params.layer,
	{
		tur: params.tur == 1,
		okt: params.okt == 1,
		ddk: params.ddk == 1,
		akt: params.akt == 1
	}
);

const url = new Url(map, share);
url.bindUrlUpdateHooks();

$(window).on('updateUrl', url.update);

$('#introduction-toggler').on('click', introduction.toggle);

$(window).on('search-results-show', introduction.overDrawn);
$(window).on('search-results-hide', introduction.overDrawnEnd);

if (markerDefined) {
	Marker.displayRedMarker(map, [lat, lon], params.mtext);
}

// If the params define an osm type and id
if (params.type && params.id) {
	Marker.fromTypeAndId(params.type, params.id, params.zoom, map);
}

// Update Org urls on page load
url.updateOrgUrls();

const autocomplete = new Autocomplete(map);
autocomplete.initUi('#search-area input.autocomplete');

// Focus search field in browsers on load
if (!MobileDetector.isMobile()) {
	$('input#text-search').focus();
}

$('#search form').on('submit', function (event) {
	event.preventDefault();

	var selectedPoiGroup  = $('#poi-search').select2('val');
	if (selectedPoiGroup.length > 0) {
		PoiLayer.displayPoiLayer(map, selectedPoiGroup);
	}

	var field = $('input#text-search');

	search.focusIfCoordinates(field.val());

	search.nominatim({
		field: field,
		resultRenderer: search.resultRenderer
	});
});

const directionsApi = new DirectionsApi();
const directionsResultLayer = new DirectionsResultLayer(window.map, directionsApi);
const directionsControl = new DirectionsControl(directionsResultLayer);
directionsControl.initializeControls();

$(document).ready(() => {
	select2.initialize();

	if (params.poi) {
		PoiLayer.displayPoiLayer(window.map, params.poi);
		select2.set(params.poi);
	}

	setTimeout(() => {
		OverpassEndpoint.measureEndpointLoadTimes();
	}, 1000);
});

// Search results use this global function on click
window.searchDetails = search.details;

function repositionMap () {
	if (MobileDetector.isMobile()) {
		$('#map-container').css('top', $('#header').css('height'))
	}
}

repositionMap();
$(window).on('mode-change', repositionMap);

function popupResize () {
	var width = $(window).width() - 135;
	$('.leaflet-popup-content').css('max-width', width);
}

$(window).on('resize', popupResize);
$(window).on('popup-open', popupResize);
