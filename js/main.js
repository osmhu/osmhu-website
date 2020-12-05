/* globals window, document */

require('@babel/polyfill');

const $ = require('jquery');
const log = require('loglevel');

const MobileDetector = require('./common/MobileDetector');
const DirectionsApi = require('./directions/DirectionsApi');
const DirectionsControl = require('./directions/DirectionsControl');
const DirectionsResultLayer = require('./directions/DirectionsResultLayer');
const Marker = require('./marker/Marker');
const Introduction = require('./introduction/Introduction');
const OverpassEndpoint = require('./poi/OverpassEndpoint');
const PoiLayers = require('./poi/PoiLayers');
const PoiLayerSelector = require('./poi/PoiLayerSelector');
const Autocomplete = require('./search/Autocomplete');
const NominatimSearch = require('./search/NominatimSearch');
const SearchResults = require('./search/SearchResults');
const SearchField = require('./search/SearchField');
const Url = require('./url/Url');
const UrlParams = require('./url/UrlParams');
const Share = require('./share/Share');
const Map = require('./map/Map');

log.setLevel('info');

const urlParams = new UrlParams(window.location.search);

const map = new Map({
	lat: urlParams.lat,
	lon: urlParams.lon,
	zoom: urlParams.zoom,
}, urlParams.layer, {
	tur: urlParams.isOverlayActive('tur'),
	okt: urlParams.isOverlayActive('okt'),
	ddk: urlParams.isOverlayActive('ddk'),
	akt: urlParams.isOverlayActive('akt'),
});

if (urlParams.isMarkerDefined()) {
	Marker.displayRedMarker(map, [urlParams.lat, urlParams.lon], urlParams.markerText);
}

if (urlParams.isOsmObjectDefined()) {
	Marker.fromTypeAndId(urlParams.osmObjectType, urlParams.osmObjectId, map);
}

const share = new Share(map);

const poiLayers = new PoiLayers(map);

const url = new Url(map, share, poiLayers);

$(window).on('updateUrl', url.update);

// Update Org urls on page load
url.updateOrgUrls();

const autocomplete = new Autocomplete(map);
// Initialize all autocomplete fields
autocomplete.initUi('#search-area input.autocomplete');

const searchResults = new SearchResults(map, '#search-results');

const nominatimSearch = new NominatimSearch(map, searchResults);

const searchField = new SearchField('input#text-search');

const introduction = new Introduction(searchResults);
introduction.initUi();

// Focus search field in browsers on load
if (!MobileDetector.isMobile()) {
	searchField.focus();
}

const poiLayerSelector = new PoiLayerSelector(poiLayers);

$('#search form').on('submit', async (event) => {
	event.preventDefault();

	searchField.enableSearchingState();
	await nominatimSearch.search(searchField.value);
	searchField.disableSearchingState();
});

const directionsApi = new DirectionsApi();
const directionsResultLayer = new DirectionsResultLayer(window.map, directionsApi);
const directionsControl = new DirectionsControl(directionsResultLayer);
directionsControl.initializeControls();

$(document).ready(() => {
	if (urlParams.isPoiLayersDefined()) {
		urlParams.poiLayers.forEach((poiSearchId) => {
			poiLayerSelector.activate(poiSearchId);
		});
	}

	setTimeout(() => {
		OverpassEndpoint.measureEndpointLoadTimes();
	}, 1000);
});

function repositionMap() {
	if (MobileDetector.isMobile()) {
		$('#map-container').css('top', $('#header').css('height'));
	}
}

repositionMap();
$(window).on('mode-change', repositionMap);

function popupResize() {
	const width = $(window).width() - 135;
	$('.leaflet-popup-content').css('max-width', width);
}

$(window).on('resize', popupResize);
$(window).on('popup-open', popupResize);
