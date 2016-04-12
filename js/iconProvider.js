// Guess a matching icon for a given element
// An element with amenity=restaurant will return `/vendor/mapiconscollection/restaurant.png`
var $ = require('jquery');
var isMobile = $(window).width() < 699;

module.exports = function iconProvider (element, options) {
	options = options || {};

	var iconUrl = options.dir || '/vendor/mapiconscollection/';
	var amenity = element.tags.amenity;
	var shop = element.tags.shop;
	var tourism = element.tags.tourism;
	var leisure = element.tags.leisure;
	var natural = element.tags.natural;

	if (amenity && amenity in icons.amenity) {
		iconUrl+= icons.amenity[amenity];
	} else if (shop && shop in icons.shop) {
		iconUrl+= icons.shop[shop];
	} else if (tourism && tourism in icons.tourism) {
		iconUrl+= icons.tourism[tourism];
	} else if (leisure && leisure in icons.leisure) {
		iconUrl+= icons.leisure[leisure];
	} else if (natural && natural in icons.natural) {
		iconUrl+= icons.natural[natural];
	} else {
		// No icon found, return false
		return false;
	}

	return {
		iconUrl: iconUrl,
		iconSize: isMobile ? [38, 44] : [32, 37],
		iconAnchor: [16, 36]
	};
};

// This object maps the tag details to the marker icons present in the `mapiconscollection` icon set
var icons = {
	amenity: {
		atm:              'atm-2.png',
		bank:             'bank.png',
		bureau_de_change: 'currencyexchange.png',
		restaurant:       'restaurant.png',
		fast_food:        'fastfood.png',
		cafe:             'coffee.png',
		bar:              'bar.png',
		pub:              'bar.png',
		clinic:           'hospital-building.png',
		hospital:         'hospital-building.png',
		dentist:          'dentist.png',
		doctors:          'medicine.png',
		pharmacy:         'drugstore.png',
		veterinary:       'veterinary.png',
		place_of_worship: 'church-2.png',
		cinema:           'cinema.png',
		community_centre: 'communitycentre.png',
		library:          'library.png',
		theatre:          'theater.png',
		swimming_pool:    'swimming.png',
		kindergarten:     'daycare.png',
		school:           'school.png',
		university:       'university.png',
		fuel:             'fillingstation.png',
		parking:          'parkinggarage.png',
		drinking_water:   'drinkingwater.png',
		toilets:          'toilets.png',
		recycling:        'recycle.png'
	},
	shop: {
		convenience:      'conveniencestore.png',
		supermarket:      'supermarket.png',
		bakery:           'bread.png',
		clothes:          'clothers_male.png',
		hairdresser:      'barber.png',
		florist:          'flowers.png',
		confectionery:    'candy.png',
		greengrocer:      'fruits.png',
		bicycle:          'bicycle_shop.png'
	},
	tourism: {
		museum:           'museum_art.png',
		guest_house:      'bed_breakfast1-2.png', // TODO What the fuck is a guest house?
		hostel:           'hostel_0star.png',
		hotel:            'hotel_0star.png',
		information:      'information.png'
	},
	leisure: {
		park:             'forest.png',
		playground:       'playground.png',
		sports_centre:    'indoor-arena.png',
		pitch:            'soccer.png',
		track:            'jogging.png',
		fitness_station:  'fitness.png',
		beach_resort:     'beach.png',
		water_park:       'waterpark.png',
		swimming_pool:    'swimming.png'
	},
	natural: {
		beach:            'lake.png'
	}
};
