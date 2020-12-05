const L = require('leaflet');

const MobileDetector = require('../common/MobileDetector');

// Prioritized list of icons from `mapiconscollection` icon set
// The first icon is returned, that has matching tags
// Example: If the given tags have amenity=atm in them, function returns 'atm-2.png' icon
const tagIcons = {
	amenity: {
		atm: 'atm-2.png',
		bank: 'bank.png',
		bureau_de_change: 'currencyexchange.png',
		restaurant: 'restaurant.png',
		fast_food: 'fastfood.png',
		cafe: 'coffee.png',
		bar: 'bar.png',
		pub: 'bar.png',
		clinic: 'hospital-building.png',
		hospital: 'hospital-building.png',
		dentist: 'dentist.png',
		doctors: 'medicine.png',
		pharmacy: 'drugstore.png',
		veterinary: 'veterinary.png',
		place_of_worship: 'church-2.png',
		cinema: 'cinema.png',
		community_centre: 'communitycentre.png',
		library: 'library.png',
		theatre: 'theater.png',
		swimming_pool: 'swimming.png',
		kindergarten: 'daycare.png',
		school: 'school.png',
		university: 'university.png',
		college: 'university.png',
		fuel: 'fillingstation.png',
		parking: 'parkinggarage.png',
		drinking_water: 'drinkingwater.png',
		toilets: 'toilets.png',
		recycling: 'recycle.png',
	},
	shop: {
		convenience: 'conveniencestore.png',
		supermarket: 'supermarket.png',
		tobacco: 'smoking.png',
		clothes: 'clothers_male.png',
		bakery: 'bread.png',
		hairdresser: 'barber.png',
		car_repair: 'carrepair.png',
		florist: 'flowers.png',
		greengrocer: 'fruits.png',
		confectionery: 'candy.png',
		beauty: 'beautysalon.png',
		car: 'car.png',
		chemist: 'drogerie.png',
		butcher: 'butcher-2.png',
		bicycle: 'bicycle_shop.png',
	},
	tourism: {
		museum: 'museum_art.png',
		guest_house: 'bed_breakfast1-2.png',
		hostel: 'hostel_0star.png',
		hotel: 'hotel_0star.png',
		information: 'information.png',
	},
	leisure: {
		park: 'forest.png',
		playground: 'playground.png',
		sports_centre: 'indoor-arena.png',
		pitch: 'soccer.png',
		track: 'jogging.png',
		fitness_station: 'fitness.png',
		beach_resort: 'beach.png',
		water_park: 'waterpark.png',
		swimming_pool: 'swimming.png',
	},
	natural: {
		beach: 'lake.png',
	},
};

module.exports = class IconProvider {
	constructor(tags) {
		this.tags = tags;
	}

	tagKeyMatched(tagKey) {
		return this.tags[tagKey] && this.tags[tagKey] in tagIcons[tagKey];
	}

	iconForTagKey(tagKey) {
		const baseUrl = '/kepek/mapicons/marker/';
		const tagValue = this.tags[tagKey];
		const imageUrl = tagIcons[tagKey][tagValue];

		return L.icon({
			iconUrl: baseUrl + imageUrl,
			iconSize: MobileDetector.isMobile() ? [38, 44] : [32, 37],
			iconAnchor: [16, 35],
		});
	}

	getFirstMatchingIcon() {
		if (this.tagKeyMatched('amenity')) {
			return this.iconForTagKey('amenity');
		}

		if (this.tagKeyMatched('shop')) {
			return this.iconForTagKey('shop');
		}

		if (this.tagKeyMatched('tourism')) {
			return this.iconForTagKey('tourism');
		}

		if (this.tagKeyMatched('leisure')) {
			return this.iconForTagKey('leisure');
		}

		if (this.tagKeyMatched('natural')) {
			return this.iconForTagKey('natural');
		}

		throw new Error('No tag matched');
	}
};
