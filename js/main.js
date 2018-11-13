/* globals window, document */

require('@babel/polyfill');

const $ = require('jquery');

// Parse params
var queryString = require('query-string');
var params = queryString.parse(location.search);

var search = require('./search');
var DirectionsApi = require('./directions/DirectionsApi');
var DirectionsControl = require('./directions/DirectionsControl');
var DirectionsResultLayer = require('./directions/DirectionsResultLayer');
var url = require('./url');
var marker = require('./marker');
var introduction = require('./introduction');
var overpass = require('./overpass');

// Initializes all autocomplete fields
const Autocomplete = require('./search/Autocomplete');

var select2 = require('./select2');
var promotion = require('./promotion');
var Map = require('./map/Map');

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

const map = new Map(
	url,
	{
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

$(window).on('updateUrl', url.update);

$('#introduction-toggler').on('click', introduction.toggle);

$(window).on('search-results-show', introduction.overDrawn);
$(window).on('search-results-hide', introduction.overDrawnEnd);

if (markerDefined) {
	// Display a marker at the given position with the text in the url
	marker.displayOnLoad({
		lat:  lat,
		lon:  lon,
		text: params.mtext
	});
}

// If the params define an osm type and id
if (params.type && params.id) {
	marker.fromTypeAndId(params.type, params.id, params.zoom);
}

// Update Org urls on page load
url.updateOrgUrls();

const autocomplete = new Autocomplete('#search-area input.autocomplete');

// Focus search field in browsers on load
var isMobile = $(window).width() < 699;
if (!isMobile) {
	$('input#text-search').focus();
}

$('#search form').on('submit', function (event) {
	event.preventDefault();

	var selectedPoiGroup  = $('#poi-search').select2('val');
	if (selectedPoiGroup.length > 0) {
		select2.poiSearch(selectedPoiGroup);
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

select2.initialize();

$(document).ready(() => {
	setTimeout(() => {
		overpass.measureEndpointLoadTimes();
	}, 1000);
});

if (params.poi) {
	select2.poiSearch(params.poi);
	select2.set(params.poi);
}

// Search results use this global function on click
window.searchDetails = search.details;

function repositionMap () {
	var isMobile = $(window).width() < 699;
	if (isMobile) {
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
