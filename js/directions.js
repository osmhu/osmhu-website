var $ = require('jquery');

var directions = module.exports = {};

var apikey = 'Fmjtd%7Cluu829ur25%2C82%3Do5-9w1gqr';

var directionsAvailable = true;

directions.loadJs = function () {
	var mapJs = 'http://open.mapquestapi.com/sdk/leaflet/v1.s/mq-map.js?key=' + apikey;
	var routingJs = 'http://open.mapquestapi.com/sdk/leaflet/v1.s/mq-routing.js?key=' + apikey;
	
	$.getScript(mapJs)
	.done(function () {
		$.getScript(routingJs);
	})
	.fail(function () {
		if (typeof MQ === 'undefined') {
			directionsAvailable = false;
		}
	});
};

directions.convertToMapQuestFormat = function (string) {
	var parts = string.split(',');
	var city = parts[0];

	var allOtherParts = '';
	for (var i = 1; i < parts.length; i++) {
		allOtherParts+= parts[i] + ', ';
	}

	return allOtherParts + parts[0] + ', Hungary';
};

var startField = $('#directions #directions-start-search');
var endField = $('#directions #directions-end-search');

var activeTransportType = 'fastest';
var avoidTollRoads = false;

directions.initializeModes = function () {
	directions.loadJs();

	$('#search-area #mode-selector #search-mode a').click(function (event) {
		event.preventDefault();
		$('#search-area #mode-selector #search-mode').addClass('active');
		$('#search-area #mode-selector #directions-mode').removeClass('active');
		$('#search').show();
		$('#directions').hide();
		$('body').removeClass('directions-active');
		$('#search-area input#text-search').focus();
		$(window).trigger('mode-change');
	});

	$('#search-area #mode-selector #directions-mode a').click(function (event) {
		event.preventDefault();
		if (!directionsAvailable) {
			$('#general-error').fadeIn(200);
			var html = '<strong>Az útvonaltervezés jelenleg nem elérhető!</strong><br />'
			html+= 'Tipp: használd az <a href="http://www.openstreetmap.org/directions" target="_blank">OpenStreetMap.org útvonaltervezőt!</a>';
			$('#general-error').html(html);
			setTimeout(function () {
				$('#general-error').fadeOut(200);
			}, 10000);
		} else {
			$('#search-area #mode-selector #directions-mode').addClass('active');
			$('#search-area #mode-selector #search-mode').removeClass('active');
			$('#directions').show();
			$('#search').hide();
			$('body').addClass('directions-active');
			startField.focus();
			$(window).trigger('mode-change');
		}
	});
};

$('#directions form').on('submit', function (event) {
	event.preventDefault();

	var start = startField.val();
	var end = endField.val();

	if (start.length < 3) {
		startField.css('border-color', 'red');
	} else {
		startField.css('border-color', '#aaa');
	}

	if (end.length < 3) {
		endField.css('border-color', 'red');
	} else {
		endField.css('border-color', '#aaa');
	}

	if (start.length >= 3 && end.length >= 3) {
		var routeStart = directions.convertToMapQuestFormat(start);
		var routeEnd = directions.convertToMapQuestFormat(end);

		directions.route(routeStart, routeEnd);

		endField.addClass('searching');
	}
});

$('#direction-results-avoid-toll-roads').on('change', function (event) {
	var checked = $('#direction-results-avoid-toll-roads').prop('checked');
	avoidTollRoads = checked;
	$('#directions form').trigger('submit');
});

$('#direction-results-choose-type').on('change', function (event) {
	var newType = $('#direction-results-choose-type').val();
	activeTransportType = newType;
	$('#directions form').trigger('submit');
});

var activeRoutingLayer;

directions.route = function (start, end) {
	if (activeRoutingLayer) {
		map.removeLayer(activeRoutingLayer);
	}

	var dir = MQ.routing.directions()
	.on('success', function (data) {
		directions.process(data.route, data.info);
	})
	.on('error', function (error) {
		directions.error();
	});
	
	var avoids = avoidTollRoads ? ['toll road'] : [];

	dir.route({
		locations: [
			start,
			end
		],
		options: {
			locale:    'hu_HU',
			unit:      'k',
			routeType: activeTransportType,
			avoids:    avoids
		}
	});

	activeRoutingLayer = MQ.routing.routeLayer({
		directions: dir,
		fitBounds: true
	});

	map.addLayer(activeRoutingLayer);
};

var directionResults = $('#direction-results');

directions.process = function (directions, info) {
	var html = '<p class="total-time">Útidő: <span class="time">';
	html+= directions.formattedTime;
	html+= '</span></p>';
	html+= '<p class="total-length">Útvonal: <span class="length">';
	var distance = Math.round(parseFloat(directions.distance) * 10) / 10;
	html+= distance;
	html+= '</span> km</p>';
	if (directions.legs) {
		var legs = directions.legs;

		var i = 0;
		var j = 0;
		html+= '<table>';
		for (; i < legs.length; i++) {
			for (j = 0; j < legs[i].maneuvers.length; j++) {
				maneuver = legs[i].maneuvers[j];
				html+= '<tr onclick="map.setView([' + maneuver.startPoint.lat + ',' + maneuver.startPoint.lng + '],14);">';
				if (maneuver) {
					if (maneuver.iconUrl) {
						html+= '<td><img src="' + maneuver.iconUrl + '"></td>';
					}
					if (maneuver.narrative) {
						html+= '<td class="narrative">' + maneuver.narrative + '</td>';
					}
					if (maneuver.distance) {
						var maneuverDistance = Math.round(parseFloat(maneuver.distance) * 10) / 10;
						html+= '<td class="distance">' + maneuverDistance + '&nbsp;km</td>';
					} else {
						html+= '<td></td>';
					}
				}
				html+= '</tr>';
			}
		}
		html+= '</table>';

		html+= '<p class="copyright">Az útvonaltervezés a <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> használatával történt. Köszönjük!</p>';

		directionResults.find('.results').html(html);

		directionResults.find('.no-results').hide();
		directionResults.find('.results').show();
		directionResults.show();
		endField.removeClass('searching');
		$(window).trigger('search-results-show');
	}
};

directions.error = function () {
	directionResults.find('.no-results').show();
	directionResults.find('.results').hide();
	directionResults.show();
	endField.removeClass('searching');
	$(window).trigger('search-results-show');
};

directionResults.find('a.close').on('click', function () {
	directionResults.hide();

	$(window).trigger('search-results-hide');
});
