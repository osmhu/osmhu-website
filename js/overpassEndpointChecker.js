var $ = require('jquery');

var overpassEndpointChecker = module.exports = {};

var overpassEndpoints = [
	'http://overpass-api.de/api/',
	'http://overpass.osm.rambler.ru/cgi/',
	'http://api.openstreetmap.fr/oapi/interpreter/'
];

var bestEndpoint = overpassEndpoints[0];

var results = {};

var testQuery = 'interpreter?data=[out:json];node(47.48,19.02,47.5,19.05)["amenity"="cafe"];out;';

overpassEndpointChecker.getBestendpoint = function (options) {
	overpassEndpoints.forEach(function (overpassEndpoint, i) {
		var start = performance.now();

		$.getJSON(overpassEndpoint + testQuery)
		.then(function (result) {
			var end = performance.now();

			var time = end - start;

			compareResults(overpassEndpoint, time);
		});
	});

	return bestEndpoint;
};

function compareResults (overpassEndpoint, time) {
	if (results.hasOwnProperty(bestEndpoint)) {
		//console.log('Current best endpoint', bestEndpoint, 'took', results[bestEndpoint], 'ms');
	}

	//console.log('Endpoint', overpassEndpoint, 'took', time, 'ms');
	results[overpassEndpoint] = time;

	if (!results.hasOwnProperty(bestEndpoint) || results[bestEndpoint] > time) {
		bestEndpoint = overpassEndpoint;
		//console.log('New best endpoint found', bestEndpoint);
	} else {
		//console.log('Best endpoint remains', bestEndpoint);
	}
};
