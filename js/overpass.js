var overpass = module.exports = {};

var $ = require('jquery');

var overpassEndpoints = require('./search/ServiceUrls').overpassEndpoints;

// Ensure endpoint urls ends with /
for (var i in overpassEndpoints) {
	if (overpassEndpoints[i].substring(overpassEndpoints[i].length - 1) !== "/") {
		overpassEndpoints[i]+='/';
	}
}

var fastestEndpoint = overpassEndpoints[0];

var endPointLoadTimes = {};

overpass.measureEndpointLoadTimes = function () {
	var testQuery = 'interpreter?data=[out:json];node(47.48,19.02,47.5,19.05)["amenity"="cafe"];out;';

	if (!performance.now) return; // IE9

	// Async comparison of available endpoints
	overpassEndpoints.forEach(function (measuredEndpoint) {
		var start = performance.now();

		$.getJSON(measuredEndpoint + testQuery)
		.then(function (result) {
			var end = performance.now();
			var time = end - start;

			//console.log('Measured endpoint', measuredEndpoint, 'took', time, 'ms');
			endPointLoadTimes[measuredEndpoint] = time;

			if (!endPointLoadTimes.hasOwnProperty(fastestEndpoint) || endPointLoadTimes[fastestEndpoint] > time) {
				fastestEndpoint = measuredEndpoint;
			}
		});
	});
};

overpass.fastestEndpoint = function () {
	//console.log('Fastest endpoint is', fastestEndpoint, ' (', endPointLoadTimes[fastestEndpoint], 'ms)');
	return fastestEndpoint;
};

/**
 * Get element details from OverPass by element type and element id
 */
overpass.getDetailsByTypeAndId = function (type, id) {
	var query = overpass.fastestEndpoint();
	query+= 'interpreter?data=[out:json];(';
	switch (type) {
		case 'node':
			query+= 'node(' + id + ');';
			break;
		case 'way':
			query+= 'way(' + id + ');node(w);';
			break;
		case 'relation':
			query+= 'relation(' + id + ');>;';
			break;
		default:
			console.error('Wrong element type', type);
	}
	query+= ');out qt 10000;'; // Limit maximal number of elements in 10000
	return $.getJSON(query);
};

// Search an element with the given id in a list of elements
overpass.findElementById = function (id, elements) {
	let idNumber = parseInt(id, 10);
 	let found = $.grep(elements, function (element) {
		return parseInt(element.id, 10) === idNumber;
	});
	return found[0];
};

overpass.getElementLocationFromResults = function (element, allElements) {
	if (!element) return;

	var position;
	var bounds;
	switch (element.type) {
		case 'way':
			var wayParts = [];
			$.each(element.nodes, function (i, nodeId) {
				var node = overpass.findElementById(nodeId, allElements);
				wayParts.push(new L.LatLng(node.lat, node.lon));
			});
			var polyline = L.polyline(wayParts, {color: 'red'});
			bounds = polyline.getBounds();
			position = bounds.getCenter();
			break;
		case 'relation':
			var polygonParts = [];
			var adminCentre = false;
			$.each(element.members, function (i, member) {
				if (member.role === 'admin_centre') {
					adminCentre = overpass.findElementById(member.ref, allElements);
				}
				if (member.type === 'way') {
					var way = overpass.findElementById(member.ref, allElements);
					$.each(way.nodes, function (j, nodeId) {
						var node = overpass.findElementById(nodeId, allElements);
						polygonParts.push(new L.LatLng(node.lat, node.lon));
					});
				} else if (member.type === 'node') {
					var node = overpass.findElementById(member.ref, allElements);
					polygonParts.push(new L.LatLng(node.lat, node.lon));
				}
			});
			// eslint-disable-next-line no-var
			var polygon = L.polygon(polygonParts, { color: 'red', fill: true });
			bounds = polygon.getBounds();
			if (adminCentre) {
				position = new L.LatLng(adminCentre.lat, adminCentre.lon);
			} else {
				position = bounds.getCenter();
			}
			break;
		case 'node':
			if (!element.tags) {
				return;
			}
			position = new L.LatLng(element.lat, element.lon);
			break;
		default:
			console.error('Unknown type');
	}

	return {
		center: position,
		bounds: bounds
	};
};

/**
 * Generate a complex query url, that can be later given to an overpassLayer
 * Examples:
 *   Get restaurants:
 *     var query = [ 'restaurant' ];
 *     var overPassLayerQuery = overpass.generateComplexQuery(query);
 *
 *   Get bar + pub + fast_food:
 *     var query = [ 'bar', 'pub', 'fast_food' ];
 *     var overPassLayerQuery = overpass.generateComplexQuery(query);
 *
 *   Get banks + amenity=ice_cream: (not in the simple set)
 *     var query = [ 'bank', 'node["amenity"="ice_cream"]' ];
 *     var overPassLayerQuery = overpass.generateComplexQuery(query);
 *
 *   Get only amenity=ice_cream: (not in the simple set)
 *     var query = [ 'node["amenity"="ice_cream"]' ];
 *     var overPassLayerQuery = overpass.generateComplexQuery(query);
 *
 *   Get amenity=ice_cream and amenity=courthouse: (both not in the simple set)
 *     var query = [ 'node["amenity"="ice_cream"]', 'node["amenity"="courthouse"]' ];
 *     var overPassLayerQuery = overpass.generateComplexQuery(query);
 *
 *   Get predefined combined query 'fooddrink':
 *     var query = overpass.combined.fooddrink;
 *     var overPassLayerQuery = overpass.generateComplexQuery(query);
 *
 */
overpass.generateComplexQuery = function (selectedList) {
	var query = '(';
	$.each(selectedList, function (i, selected) {
		if (simple[selected]) {
			query+= simple[selected] + ';';
			query+= simple[selected].replace(/node/g, 'way') + ';node(w);';
			query+= simple[selected].replace(/node/g, 'rel') + ';>;';
		} else {
			query+= selected + ';';
			query+= selected.replace(/node/g, 'way') + ';node(w);';
			query+= selected.replace(/node/g, 'rel') + ';>;';
		}
	});
	query+= ');out qt;';
	return query;
};

var simple = overpass.simple = {
	restaurant: 		'node({{bbox}})["amenity"="restaurant"]',
	fast_food: 			'node({{bbox}})["amenity"="fast_food"]',
	cafe: 				'node({{bbox}})["amenity"="cafe"]',
	convenience: 		'node({{bbox}})["shop"="convenience"]',
	supermarket: 		'node({{bbox}})["shop"="supermarket"]',
	bakery: 			'node({{bbox}})["shop"="bakery"]',
	clothes: 			'node({{bbox}})["shop"="clothes"]',
	hairdresser: 		'node({{bbox}})["shop"="hairdresser"]',
	florist: 			'node({{bbox}})["shop"="florist"]',
	confectionery:      'node({{bbox}})["shop"="confectionery"]',
	greengrocer:        'node({{bbox}})["shop"="greengrocer"]',
	bicycle: 			'node({{bbox}})["shop"="bicycle"]',
	atm: 				'(node({{bbox}})["amenity"="atm"];node({{bbox}})["amenity"="bank"]["atm"="yes"];)',
	bank: 				'node({{bbox}})["amenity"="bank"]',
	bureau_de_change: 	'node({{bbox}})["amenity"="bureau_de_change"]',
	bar: 				'node({{bbox}})["amenity"="bar"]',
	pub: 				'node({{bbox}})["amenity"="pub"]',
	guest_house: 		'node({{bbox}})["tourism"="guest_house"]',
	hostel: 			'node({{bbox}})["tourism"="hostel"]',
	hotel: 				'node({{bbox}})["tourism"="hotel"]',
	information: 		'node({{bbox}})["tourism"="information"]',
	clinic: 			'node({{bbox}})["amenity"="clinic"]',
	hospital: 			'node({{bbox}})["amenity"="hospital"]',
	dentist: 			'node({{bbox}})["amenity"="dentist"]',
	doctors: 			'node({{bbox}})["amenity"="doctors"]',
	pharmacy: 			'node({{bbox}})["amenity"="pharmacy"]',
	veterinary: 		'node({{bbox}})["amenity"="veterinary"]',
	place_of_worship:   'node({{bbox}})["amenity"="place_of_worship"]',
	cinema: 			'node({{bbox}})["amenity"="cinema"]',
	community_centre: 	'node({{bbox}})["amenity"="community_centre"]',
	library: 			'node({{bbox}})["amenity"="library"]',
	museum: 			'node({{bbox}})["tourism"="museum"]',
	theatre: 			'node({{bbox}})["amenity"="theatre"]',
	park: 				'node({{bbox}})["leisure"="park"]',
	playground: 		'node({{bbox}})["leisure"="playground"]',
	sports_centre:      '(node({{bbox}})["leisure"="pitch"];node({{bbox}})["leisure"="track"];node({{bbox}})["leisure"="sports_centre"];)',
	fitness_station:    'node({{bbox}})["leisure"="fitness_station"]',
	beach_resort:       'node({{bbox}})["leisure"="beach_resort"]',
	water_park:         'node({{bbox}})["leisure"="water_park"]',
	natural_beach:      'node({{bbox}})["natural"="beach"]',
	swimming: 			'node({{bbox}})["leisure"="sports_centre"]["sport"="swimming"]',
	kindergarten: 		'node({{bbox}})["amenity"="kindergarten"]',
	school: 			'node({{bbox}})["amenity"="school"]',
	university: 		'(node({{bbox}})["amenity"="university"];node({{bbox}})["amenity"="college"])',
	fuel: 				'node({{bbox}})["amenity"="fuel"]',
	parking: 			'node({{bbox}})["amenity"="parking"]',
	drinking_water: 	'node({{bbox}})["amenity"="drinking_water"]',
	toilets: 			'node({{bbox}})["amenity"="toilets"]',
	recycling: 			'node({{bbox}})["amenity"="recycling"]'
};

var combined = overpass.combined = {
	fooddrink: [
		simple.restaurant,
		simple.fast_food,
		simple.cafe,
		simple.bar,
		simple.pub
	],
	shop: [
		simple.convenience,
		simple.supermarket,
		simple.bakery,
		simple.clothes,
		simple.hairdresser,
		simple.florist,
		simple.confectionery,
		simple.greengrocer,
		simple.bicycle
	],
	money: [
		simple.atm,
		simple.bank,
		simple.bureau_de_change
	],
	accommodation: [
		simple.guest_house,
		simple.hostel,
		simple.hotel,
		simple.information
	],
	healthcare: [
		simple.clinic,
		simple.hospital,
		simple.dentist,
		simple.doctors,
		simple.pharmacy,
		simple.veterinary
	],
	leisure: [
		simple.place_of_worship,
		simple.cinema,
		simple.community_centre,
		simple.library,
		simple.museum,
		simple.theatre,
		simple.park,
		simple.playground,
		simple.sports_centre,
		simple.fitness_station
	],
	strand: [
		simple.beach_resort,
		simple.water_park,
		simple.natural_beach,
		simple.swimming
	],
	education: [
		simple.kindergarten,
		simple.school,
		simple.university
	],
	travel: [
		simple.fuel,
		simple.parking
	],
	other: [
		simple.drinking_water,
		simple.toilets,
		simple.recycling
	]
};
