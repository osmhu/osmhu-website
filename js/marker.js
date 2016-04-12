var $ = require('jquery');
var L = require('leaflet');

var helpers = require('./helpers');
var url = require('./url');
var popup = require('./popup');
var overpass = require('./overpass');
var iconProvider = require('./iconProvider');

var marker = module.exports = {};

var isMobile = $(window).width() < 699;

// Display a marker on page load
marker.displayOnLoad = function (options) {
	var lat  = options.lat;
	var lon  = options.lon;
	var text = options.text || '';

	// Create a red marker icon
	var redIcon = L.icon({
		iconUrl: 'kepek/marker-icon-red.png',
		iconAnchor: [ 13, 40 ]
	});

	// Create a red marker at [ lat, lon ]
	var redMarker = new L.marker([ lat, lon ], {
		icon: redIcon
	});

	// Add to map
	redMarker.addTo(map);

	// Open popup if text is set in the url
	if (text.length > 0) {
		var html = '<div class="popup-loaded-marker">';
		    html+= url.escapeTags(text);
		    html+= '</div>';
		redMarker.bindPopup(html, {
			offset: new L.point(0, -28)
		}).openPopup();
	}
};

// Create a marker for a given poi
marker.fromPoi = function (options) {
	var position = options.position.center;
	var poi = options.poi;
	var shareUrl = (typeof options.shareUrl !== 'undefined') ? options.shareUrl : true;

	var customMarker = L.marker(position);

	var iconOptions = options.iconProvider(poi);
	if (iconOptions) {
		var icon = new L.icon(iconOptions);
		customMarker.setIcon(icon);
	}

	// Add popup to show poi information on marker click
	var popupHtml = popup.generateHtml(poi, {
		shareUrl: shareUrl
	});

	customMarker.bindPopup(popupHtml, {
		offset: L.point(0, -24),
		autoPanPaddingTopLeft: isMobile ? [44, 5] : [46, 10],
		autoPanPaddingBottomRight: isMobile ? [54, 5] : [56, 10]
	});

	// On popup open activate copy button
	customMarker.on('popupopen', function (event) {
		if (shareUrl) {
			helpers.copyButton({
				button: $('#popup-poi-copy'),
				onCopy: function () {
					$('#popup-poi-share-url').select();
				}
			});
		}

		url.setActivePoi(poi.type, poi.id);
		$(window).trigger('popup-open');
		$(window).trigger('updateUrl');
	});

	customMarker.on('popupclose', function () {
		url.removeActivePoi();
		$(window).trigger('updateUrl');
	});

	return customMarker;
};

marker.fromTypeAndId = function (type, id, zoom, options) {
	options = options || {};
	options.callback = options.callback || function () {};

	overpass.getDetailsByTypeAndId(type, id)
	.done(function (result) {
		if (result.elements.length === 10000) return options.fallback && options.fallback();

		url.setActivePoi(type, id); // Set the url
		var element = helpers.findElementById(id, result.elements);
		if (!element) return;
		var position = helpers.getCenterPosition(element, result.elements);
		// Settings the map view is needed to calculate popup height
		map.setView(position.center, zoom, { animate: false });

		var newMarker = marker.fromPoi({
			position:     position,
			poi:          element,
			iconProvider: iconProvider
		});
		newMarker.addTo(map).openPopup();

		// Center the marker and the popup
		var positionInPixel = map.project(position.center);
		var popupHeight = newMarker._popup._container.clientHeight;
		positionInPixel.y -= popupHeight / 2;
		var combinedCenter = map.unproject(positionInPixel);

		map.setView(combinedCenter, zoom, { animate: false });

		options.callback(newMarker);
	});	
};
