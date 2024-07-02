import './common/oldBrowserSupport';

import 'regenerator-runtime/runtime';

import $ from 'jquery';
import log from 'loglevel';

import OldBrowserNotifier from './common/OldBrowserNotifier';
import MobileDetector from './common/MobileDetector';
import DirectionsApi from './directions/DirectionsApi';
import DirectionsControl from './directions/DirectionsControl';
import DirectionsResultLayer from './directions/DirectionsResultLayer';
import Marker from './marker/Marker';
import Introduction from './introduction/Introduction';
import OverpassEndpoint from './poi/OverpassEndpoint';
import PoiLayers from './poi/PoiLayers';
import PoiLayerSelector from './poi/PoiLayerSelector';
import Autocomplete from './search/Autocomplete';
import NominatimSearch from './search/NominatimSearch';
import SearchResults from './search/SearchResults';
import SearchField from './search/SearchField';
import Url from './url/Url';
import UrlParams from './url/UrlParams';
import Share from './share/Share';
import Map from './map/Map';

// eslint-disable-next-line no-underscore-dangle
if (!window.__DEV__) {
	log.setDefaultLevel('info');
}

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

if (urlParams.isOsmElementDefined()) {
	Marker.fromOsmElementId(urlParams.osmElementId, map);
}

const share = new Share(map);

const poiLayers = new PoiLayers(map);

const url = new Url(map, share, poiLayers);

$(window).on('updateUrl', url.update);

// Update Org urls on page load
url.updateOrgUrls();

const autocomplete = new Autocomplete(map);

const searchResults = new SearchResults(map, '.search-results');

const nominatimSearch = new NominatimSearch(map, searchResults);

const searchField = new SearchField('input#text-search');

const introduction = new Introduction(searchResults, map);

$(() => {
	autocomplete.initUi('#search-area input.autocomplete'); // Initialize all autocomplete fields
	introduction.initUi();

	// Focus search field in browsers on load
	if (!MobileDetector.isMobile()) {
		searchField.focus();
	}
});

const poiLayerSelector = new PoiLayerSelector(poiLayers);

$('#search form').on('submit', async (event) => {
	event.preventDefault();

	searchField.enableSearchingState();
	await nominatimSearch.search(searchField.value);
	searchField.disableSearchingState();
});

const directionsApi = new DirectionsApi();
const directionsResultLayer = new DirectionsResultLayer(map, directionsApi);
const directionsControl = new DirectionsControl(directionsResultLayer);
directionsControl.initializeControls();

$(document).ready(() => {
	if (urlParams.isPoiLayersDefined()) {
		urlParams.poiLayers.forEach((poiSearchId) => {
			poiLayerSelector.activate(poiSearchId);
		});
	}

	setTimeout(() => {
		OverpassEndpoint.measureAllEndpointLoadTimes();
	}, 1000);
});

function repositionMap() {
	if (MobileDetector.isMobile()) {
		$('#map-container').css('top', $('.js-page-header-for-height').css('height'));
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

OldBrowserNotifier.init();

// Production debug variables
window.osmhu = {};
window.osmhu.log = log;
window.osmhu.map = map;
