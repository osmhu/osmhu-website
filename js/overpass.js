var overpass = module.exports = {};

/**
 * Get element details from OverPass by element type and element id
 */
overpass.getDetailsByTypeAndId = function (type, id) {
	var query = 'http://overpass-api.de/api/interpreter?data=[out:json];(';
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
	var query = 'http://overpass-api.de/api/interpreter?data=[out:json][bbox:BBOX];(';
	$.each(selectedList, function (i, selected) {
		if (simple[selected]) {
			query+= simple[selected] + ';';
			query+= simple[selected].replace(/node/g, 'way') + ';node(w);';
			query+= simple[selected].replace(/node/g, 'rel') + ';';
		} else {
			query+= selected + ';';
			query+= selected.replace(/node/g, 'way') + ';node(w);';
		}
	});
	query+= ');out qt;';
	return query;
};

var simple = overpass.simple = {
	restaurant: 		'node["amenity"="restaurant"]',
	fast_food: 			'node["amenity"="fast_food"]',
	cafe: 				'node["amenity"="cafe"]',
	convenience: 		'node["shop"="convenience"]',
	supermarket: 		'node["shop"="supermarket"]',
	bakery: 			'node["shop"="bakery"]',
	clothes: 			'node["shop"="clothes"]',
	hairdresser: 		'node["shop"="hairdresser"]',
	florist: 			'node["shop"="florist"]',
	confectionery:      'node["shop"="confectionery"]',
	greengrocer:        'node["shop"="greengrocer"]',
	bicycle: 			'node["shop"="bicycle"]',
	atm: 				'(node["amenity"="atm"];node["amenity"="bank"]["atm"="yes"];)',
	bank: 				'node["amenity"="bank"]',
	bureau_de_change: 	'node["amenity"="bureau_de_change"]',
	bar: 				'node["amenity"="bar"]',
	pub: 				'node["amenity"="pub"]',
	guest_house: 		'node["tourism"="guest_house"]',
	hostel: 			'node["tourism"="hostel"]',
	hotel: 				'node["tourism"="hotel"]',
	information: 		'node["tourism"="information"]',
	clinic: 			'node["amenity"="clinic"]',
	hospital: 			'node["amenity"="hospital"]',
	dentist: 			'node["amenity"="dentist"]',
	doctors: 			'node["amenity"="doctors"]',
	pharmacy: 			'node["amenity"="pharmacy"]',
	veterinary: 		'node["amenity"="veterinary"]',
	place_of_worship:   'node["amenity"="place_of_worship"]',
	cinema: 			'node["amenity"="cinema"]',
	community_centre: 	'node["amenity"="community_centre"]',
	library: 			'node["amenity"="library"]',
	museum: 			'node["tourism"="museum"]',
	theatre: 			'node["amenity"="theatre"]',
	park: 				'node["leisure"="park"]',
	playground: 		'node["leisure"="playground"]',
	sports_centre:      '(node["leisure"="pitch"];node["leisure"="track"];node["leisure"="sports_centre"];)',
	fitness_station:    'node["leisure"="fitness_station"]',
	beach_resort:       'node["leisure"="beach_resort"]',
	water_park:         'node["leisure"="water_park"]',
	natural_beach:      'node["natural"="beach"]',
	swimming_pool: 		'node["amenity"="swimming_pool"]',
	kindergarten: 		'node["amenity"="kindergarten"]',
	school: 			'node["amenity"="school"]',
	university: 		'node["amenity"="university"]',
	fuel: 				'node["amenity"="fuel"]',
	parking: 			'node["amenity"="parking"]',
	drinking_water: 	'node["amenity"="drinking_water"]',
	toilets: 			'node["amenity"="toilets"]',
	recycling: 			'node["amenity"="recycling"]'
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
		simple.swimming_pool
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
