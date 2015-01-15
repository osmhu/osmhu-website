var $ = require('jquery');

var directions = module.exports = {};

var apikey = 'Fmjtd%7Cluu829ur25%2C82%3Do5-9w1gqr';

directions.loadJs = function () {
	var mapJs = 'http://www.mapquestapi.com/sdk/leaflet/v1.s/mq-map.js?key=' + apikey;
	var routingJs = 'http://www.mapquestapi.com/sdk/leaflet/v1.s/mq-routing.js?key=' + apikey;
	
	$.getScript(mapJs, function () {
		$.getScript(routingJs);
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
}

directions.initializeModes = function () {
	directions.loadJs();

	$('#search-box #mode-selector #search-mode a').click(function (event) {
		event.preventDefault();
		$('#search-box #mode-selector #search-mode').addClass('active');
		$('#search-box #mode-selector #directions-mode').removeClass('active');
		$('form#search').css('display', 'inline-block');
		$('form#directions').hide();
		$('#search-box input#text-search').focus();
	});

	$('#search-box #mode-selector #directions-mode a').click(function (event) {
		event.preventDefault();
		$('#search-box #mode-selector #directions-mode').addClass('active');
		$('#search-box #mode-selector #search-mode').removeClass('active');
		$('form#directions').css('display', 'inline-block');
		$('form#search').hide();
		$('#search-box input#directions-start-search').focus();
	});

	$('#search-box form#directions').on('submit', function (event) {
		event.preventDefault();
		var start = $('#search-box form#directions #directions-start-search').val();
		var end = $('#search-box form#directions #directions-end-search').val();

		if (start.length < 3) {
			$('#search-box form#directions #directions-start-search').css('border-color', 'red');
		} else {
			$('#search-box form#directions #directions-start-search').css('border-color', '#aaa');
		}

		if (end.length < 3) {
			$('#search-box form#directions #directions-end-search').css('border-color', 'red');
		} else {
			$('#search-box form#directions #directions-end-search').css('border-color', '#aaa');
		}

		if (start.length >= 3 && end.length >= 3) {
			start = directions.convertToMapQuestFormat(start);
			end = directions.convertToMapQuestFormat(end);
			directions.route(start, end);
		}
	});
};

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

	dir.route({
		locations: [
			start,
			end
		],
		options: {
			locale: 'hu_HU',
			unit:   'k'
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
						var distance = Math.round(parseFloat(maneuver.distance) * 10) / 10;
						html+= '<td class="distance">' + distance + '&nbsp;km</td>';
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
		$(window).trigger('search-results-show');
	}
};

directions.error = function () {
	directionResults.find('.no-results').show();
	directionResults.find('.results').hide();
	directionResults.show();
	$(window).trigger('search-results-show');
};

directionResults.find('a.close').on('click', function () {
	directionResults.hide();

	$(window).trigger('search-results-hide');
});
