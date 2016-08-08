var overpass = module.exports = {};

/**
 * Get element details from OverPass by element type and element id
 */
overpass.getDetailsByTypeAndId = function (type, id) {
	var query = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=[out:json];(';
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
	restaurant: 		'node(BBOX)["amenity"="restaurant"]',
	fast_food: 			'node(BBOX)["amenity"="fast_food"]',
	cafe: 				'node(BBOX)["amenity"="cafe"]',
	convenience: 		'node(BBOX)["shop"="convenience"]',
	supermarket: 		'node(BBOX)["shop"="supermarket"]',
	bakery: 			'node(BBOX)["shop"="bakery"]',
	clothes: 			'node(BBOX)["shop"="clothes"]',
	hairdresser: 		'node(BBOX)["shop"="hairdresser"]',
	florist: 			'node(BBOX)["shop"="florist"]',
	confectionery:      'node(BBOX)["shop"="confectionery"]',
	greengrocer:        'node(BBOX)["shop"="greengrocer"]',
	bicycle: 			'node(BBOX)["shop"="bicycle"]',
	atm: 				'(node(BBOX)["amenity"="atm"];node(BBOX)["amenity"="bank"]["atm"="yes"];)',
	bank: 				'node(BBOX)["amenity"="bank"]',
	bureau_de_change: 	'node(BBOX)["amenity"="bureau_de_change"]',
	bar: 				'node(BBOX)["amenity"="bar"]',
	pub: 				'node(BBOX)["amenity"="pub"]',
	guest_house: 		'node(BBOX)["tourism"="guest_house"]',
	hostel: 			'node(BBOX)["tourism"="hostel"]',
	hotel: 				'node(BBOX)["tourism"="hotel"]',
	information: 		'node(BBOX)["tourism"="information"]',
	clinic: 			'node(BBOX)["amenity"="clinic"]',
	hospital: 			'node(BBOX)["amenity"="hospital"]',
	dentist: 			'node(BBOX)["amenity"="dentist"]',
	doctors: 			'node(BBOX)["amenity"="doctors"]',
	pharmacy: 			'node(BBOX)["amenity"="pharmacy"]',
	veterinary: 		'node(BBOX)["amenity"="veterinary"]',
	place_of_worship:   'node(BBOX)["amenity"="place_of_worship"]',
	cinema: 			'node(BBOX)["amenity"="cinema"]',
	community_centre: 	'node(BBOX)["amenity"="community_centre"]',
	library: 			'node(BBOX)["amenity"="library"]',
	museum: 			'node(BBOX)["tourism"="museum"]',
	theatre: 			'node(BBOX)["amenity"="theatre"]',
	park: 				'node(BBOX)["leisure"="park"]',
	playground: 		'node(BBOX)["leisure"="playground"]',
	sports_centre:      '(node(BBOX)["leisure"="pitch"];node(BBOX)["leisure"="track"];node(BBOX)["leisure"="sports_centre"];)',
	fitness_station:    'node(BBOX)["leisure"="fitness_station"]',
	beach_resort:       'node(BBOX)["leisure"="beach_resort"]',
	water_park:         'node(BBOX)["leisure"="water_park"]',
	natural_beach:      'node(BBOX)["natural"="beach"]',
	swimming: 			'node(BBOX)["leisure"="sports_centre"]["sport"="swimming"]',
	kindergarten: 		'node(BBOX)["amenity"="kindergarten"]',
	school: 			'node(BBOX)["amenity"="school"]',
	university: 		'(node(BBOX)["amenity"="university"];node(BBOX)["amenity"="college"])',
	fuel: 				'node(BBOX)["amenity"="fuel"]',
	parking: 			'node(BBOX)["amenity"="parking"]',
	drinking_water: 	'node(BBOX)["amenity"="drinking_water"]',
	toilets: 			'node(BBOX)["amenity"="toilets"]',
	recycling: 			'node(BBOX)["amenity"="recycling"]'
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
