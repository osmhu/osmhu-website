/**
 * Own POI search format
 * Elements are usually retrieved by key (ex. fooddrink or restaurant)
 * overpassQuery is used for searching with Overpass API
 */

export default {
	fooddrink: {
		title: 'Vendéglátás',
		children: {
			restaurant: {
				title: 'Étterem',
				icon: 'restaurant',
				overpassQuery: [{
					amenity: 'restaurant',
				}],
			},
			fast_food: {
				title: 'Gyorsétterem',
				icon: 'fastfood',
				overpassQuery: [{
					amenity: 'fast_food',
				}],
			},
			cafe: {
				title: 'Kávézó',
				icon: 'coffee',
				overpassQuery: [{
					amenity: 'cafe',
				}],
			},
			pub: {
				title: 'Kocsma / Bár',
				icon: 'bar',
				alternativeSearchText: ['pub'],
				overpassQuery: [{
					amenity: 'bar',
				}, {
					amenity: 'pub',
				}],
			},
		},
	},
	/**
	 * Shops are ordered by shop key usage in Hungary
	 * https://taginfo.openstreetmap.hu/keys/shop#values
	*/
	shop: {
		title: 'Boltok',
		children: {
			convenience: {
				title: 'Kisbolt',
				icon: 'conveniencestore',
				overpassQuery: [{
					shop: 'convenience',
				}],
			},
			supermarket: {
				title: 'Bevásárló|központ',
				icon: 'supermarket',
				overpassQuery: [{
					shop: 'supermarket',
				}],
			},
			tobacco: {
				title: 'Dohánybolt',
				icon: 'smoking',
				overpassQuery: [{
					shop: 'tobacco',
				}],
			},
			clothes: {
				title: 'Ruházati bolt',
				icon: 'clothers_male',
				overpassQuery: [{
					shop: 'clothes',
				}],
			},
			bakery: {
				title: 'Pékség',
				icon: 'bread',
				overpassQuery: [{
					shop: 'bakery',
				}],
			},
			hairdresser: {
				title: 'Fodrász',
				icon: 'barber',
				overpassQuery: [{
					shop: 'hairdresser',
				}],
			},
			car_repair: {
				title: 'Autószerviz',
				icon: 'carrepair',
				overpassQuery: [{
					shop: 'car_repair',
				}],
			},
			florist: {
				title: 'Virágbolt',
				icon: 'garden',
				overpassQuery: [{
					shop: 'florist',
				}],
			},
			greengrocer: {
				title: 'Zöldséges',
				icon: 'fruits',
				overpassQuery: [{
					shop: 'greengrocer',
				}],
			},
			confectionery: {
				title: 'Cukrászda',
				icon: 'candy',
				overpassQuery: [{
					shop: 'confectionery',
				}],
			},
			beauty: {
				title: 'Szépségszalon',
				icon: 'beautysalon',
				overpassQuery: [{
					shop: 'beauty',
				}],
			},
			car: {
				title: 'Autószalon',
				icon: 'car',
				overpassQuery: [{
					shop: 'car',
				}],
			},
			chemist: {
				title: 'Drogéria',
				icon: 'drogerie',
				overpassQuery: [{
					shop: 'chemist',
				}],
			},
			butcher: {
				title: 'Húsbolt',
				icon: 'butcher-2',
				overpassQuery: [{
					shop: 'butcher',
				}],
			},
			bicycle: {
				title: 'Kerékpárbolt',
				icon: 'bicycle_shop',
				alternativeSearchText: ['Biciklibolt'],
				overpassQuery: [{
					shop: 'bicycle',
				}],
			},
		},
	},
	money: {
		title: 'Pénz',
		children: {
			atm: {
				title: 'Bankautomata',
				icon: 'atm-2',
				alternativeSearchText: ['ATM'],
				overpassQuery: [{
					amenity: 'atm',
				}, {
					amenity: 'bank',
					atm: 'yes',
				}],
			},
			bank: {
				title: 'Bank',
				icon: 'bank_euro',
				overpassQuery: [{
					amenity: 'bank',
				}],
			},
			bureau_de_change: {
				title: 'Pénzváltó',
				icon: 'currencyexchange',
				alternativeSearchText: ['Valutaváltó'],
				overpassQuery: [{
					amenity: 'bureau_de_change',
				}],
			},
		},
	},
	accommodation: {
		title: 'Szállás',
		children: {
			guest_house: {
				title: 'Vendégház',
				icon: 'bed_breakfast1-2',
				overpassQuery: [{
					tourism: 'guest_house',
				}],
			},
			hostel: {
				title: 'Turistaszálló',
				icon: 'hostel_0star',
				overpassQuery: [{
					tourism: 'hostel',
				}],
			},
			hotel: {
				title: 'Szálloda',
				icon: 'hotel_0star',
				alternativeSearchText: ['Hotel'],
				overpassQuery: [{
					tourism: 'hotel',
				}],
			},
			information: {
				title: 'Információ',
				icon: 'information',
				overpassQuery: [{
					tourism: 'information',
				}],
			},
		},
	},
	healthcare: {
		title: 'Egészségügy',
		children: {
			hospital: {
				title: 'Kórház / Klinika',
				icon: 'hospital-building',
				overpassQuery: [{
					amenity: 'clinic',
				}, {
					amenity: 'hospital',
				}],
			},
			dentist: {
				title: 'Fogorvos',
				icon: 'dentist',
				overpassQuery: [{
					amenity: 'dentist',
				}],
			},
			doctors: {
				title: 'Orvosi rendelő',
				icon: 'medicine',
				overpassQuery: [{
					amenity: 'doctors',
				}],
			},
			pharmacy: {
				title: 'Gyógyszertár',
				icon: 'drugstore',
				overpassQuery: [{
					amenity: 'pharmacy',
				}],
			},
			veterinary: {
				title: 'Állatorvos',
				icon: 'veterinary',
				overpassQuery: [{
					amenity: 'veterinary',
				}],
			},
		},
	},
	leisure: {
		title: 'Szabadidő',
		children: {
			place_of_worship: {
				title: 'Templom',
				icon: 'church-2',
				overpassQuery: [{
					amenity: 'place_of_worship',
				}],
			},
			cinema: {
				title: 'Mozi',
				icon: 'cinema',
				overpassQuery: [{
					amenity: 'cinema',
				}],
			},
			community_centre: {
				title: 'Művelődési központ',
				icon: 'communitycentre',
				overpassQuery: [{
					amenity: 'community_centre',
				}],
			},
			library: {
				title: 'Könyvtár',
				icon: 'library',
				overpassQuery: [{
					amenity: 'library',
				}],
			},
			museum: {
				title: 'Múzeum',
				icon: 'museum_art',
				overpassQuery: [{
					tourism: 'museum',
				}],
			},
			theatre: {
				title: 'Színház',
				icon: 'theater',
				overpassQuery: [{
					amenity: 'theatre',
				}],
			},
			park: {
				title: 'Park',
				icon: 'tree',
				overpassQuery: [{
					leisure: 'park',
				}],
			},
			playground: {
				title: 'Játszótér',
				icon: 'playground',
				overpassQuery: [{
					leisure: 'playground',
				}],
			},
			sports_centre: {
				title: 'Sportpálya',
				icon: 'indoor-arena',
				overpassQuery: [{
					leisure: 'pitch',
				}, {
					leisure: 'track',
				}, {
					leisure: 'sports_centre',
				}],
			},
			fitness_station: {
				title: 'Fitnesz park',
				icon: 'fitness',
				alternativeSearchText: ['Fitness'],
				overpassQuery: [{
					leisure: 'fitness_station',
				}],
			},
		},
	},
	strand: {
		title: 'Strand',
		children: {
			beach_resort: {
				title: 'Strand',
				icon: 'beach_icon',
				overpassQuery: [{
					leisure: 'beach_resort',
				}],
			},
			water_park: {
				title: 'Élményfürdő',
				icon: 'waterpark',
				overpassQuery: [{
					leisure: 'water_park',
				}],
			},
			natural_beach: {
				title: 'Vízparti strand',
				icon: 'lake',
				overpassQuery: [{
					natural: 'beach',
				}],
			},
			swimming: {
				title: 'Uszoda',
				icon: 'swimming',
				overpassQuery: [{
					leisure: 'sports_centre',
					sport: 'swimming',
				}],
			},
		},
	},
	education: {
		title: 'Oktatás',
		children: {
			kindergarten: {
				title: 'Óvoda',
				icon: 'daycare',
				overpassQuery: [{
					amenity: 'kindergarten',
				}],
			},
			school: {
				title: 'Iskola',
				icon: 'school',
				overpassQuery: [{
					amenity: 'school',
				}],
			},
			university: {
				title: 'Egyetem',
				icon: 'university',
				alternativeSearchText: ['Főiskola'],
				overpassQuery: [{
					amenity: 'university',
				}, {
					amenity: 'college',
				}],
			},
		},
	},
	travel: {
		title: 'Utazás',
		children: {
			fuel: {
				title: 'Benzinkút',
				icon: 'fillingstation',
				overpassQuery: [{
					amenity: 'fuel',
				}],
			},
			parking: {
				title: 'Parkoló',
				icon: 'parkinggarage',
				overpassQuery: [{
					amenity: 'parking',
				}],
			},
		},
	},
	other: {
		title: 'Egyéb',
		children: {
			drinking_water: {
				title: 'Ivóvíz',
				icon: 'drinkingwater',
				overpassQuery: [{
					amenity: 'drinking_water',
				}],
			},
			toilets: {
				title: 'Nyilvános WC',
				icon: 'toilets_inclusive',
				alternativeSearchText: ['Illemhely'],
				overpassQuery: [{
					amenity: 'toilets',
				}],
			},
			recycling: {
				title: 'Szelektív hulladékgyűjtő',
				icon: 'recycle',
				overpassQuery: [{
					amenity: 'recycling',
				}],
			},
		},
	},
};
