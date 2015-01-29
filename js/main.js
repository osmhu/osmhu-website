// Parse params
var queryString = require('query-string');
var params = queryString.parse(location.search);

var search = require('./search');
var directions = require('./directions');
var url = require('./url');
var marker = require('./marker');
var introduction = require('./introduction');
var overpass = require('./overpass');
var typeahead = require('./typeahead');
var select2 = require('./select2');

params.zoom = params.zoom || params.mzoom; // Backwards compatibility with old mzoom url's

// Default center and zoom of Hungary*/
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

require('./map').initialize({
	layer: params.layer,
	overlays: {
		tur: params.tur == 1,
		okt: params.okt == 1,
		ddk: params.ddk == 1,
		akt: params.akt == 1
	},
	url: url,
	view: {
		lat:   lat,
		lon:   lon,
		zoom:  zoom
	}
});

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

directions.initializeModes();

select2.initialize();

if (params.poi) {
	select2.poiSearch(params.poi);
	select2.set(params.poi);
}

// Search results use this global function on click
window.searchDetails = search.details;
