/**
 * Own POI search format
 * Elements are usually retrieved by key (ex. fooddrink or restaurant)
 * overpassQuery is used for searching with Overpass API
 */

module.exports = {
	fooddrink: {
		title: 'Vendéglátás',
		children: {
			restaurant: {
				title: 'Étterem',
				overpassQuery: [{
					amenity: 'restaurant',
				}],
			},
			fast_food: {
				title: 'Gyorsétterem',
				overpassQuery: [{
					amenity: 'fast_food',
				}],
			},
			cafe: {
				title: 'Kávézó',
				overpassQuery: [{
					amenity: 'cafe',
				}],
			},
			bar: {
				title: 'Bár',
				overpassQuery: [{
					amenity: 'bar',
				}],
			},
			pub: {
				title: 'Kocsma',
				alternativeSearchText: ['pub'],
				overpassQuery: [{
					amenity: 'pub',
				}],
			},
		},
	},
	/**
	 * Shops are ordered by shop key usage in Hungary
	 * http://taginfo.openstreetmap.hu/keys/shop#values
	*/
	shop: {
		title: 'Boltok',
		children: {
			convenience: {
				title: 'Kisbolt',
				overpassQuery: [{
					shop: 'convenience',
				}],
			},
			supermarket: {
				title: 'Bevásárlóközpont',
				overpassQuery: [{
					shop: 'supermarket',
				}],
			},
			bakery: {
				title: 'Pékség',
				overpassQuery: [{
					shop: 'bakery',
				}],
			},
			clothes: {
				title: 'Ruházati bolt',
				overpassQuery: [{
					shop: 'clothes',
				}],
			},
			hairdresser: {
				title: 'Fodrász',
				overpassQuery: [{
					shop: 'hairdresser',
				}],
			},
			florist: {
				title: 'Virágbolt',
				overpassQuery: [{
					shop: 'florist',
				}],
			},
			confectionery: {
				title: 'Cukrászda',
				overpassQuery: [{
					shop: 'confectionery',
				}],
			},
			greengrocer: {
				title: 'Zöldséges',
				overpassQuery: [{
					shop: 'greengrocer',
				}],
			},
			bicycle: {
				title: 'Kerékpárbolt',
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
				overpassQuery: [{
					amenity: 'bank',
				}],
			},
			bureau_de_change: {
				title: 'Pénzváltó',
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
				overpassQuery: [{
					tourism: 'guest_house',
				}],
			},
			hostel: {
				title: 'Turistaszálló',
				overpassQuery: [{
					tourism: 'hostel',
				}],
			},
			hotel: {
				title: 'Szálloda',
				alternativeSearchText: ['Hotel'],
				overpassQuery: [{
					tourism: 'hotel',
				}],
			},
			information: {
				title: 'Információ',
				overpassQuery: [{
					tourism: 'information',
				}],
			},
		},
	},
	healthcare: {
		title: 'Egészségügy',
		children: {
			clinic: {
				title: 'Klinika',
				overpassQuery: [{
					amenity: 'clinic',
				}],
			},
			hospital: {
				title: 'Kórház',
				overpassQuery: [{
					amenity: 'hospital',
				}],
			},
			dentist: {
				title: 'Fogorvos',
				overpassQuery: [{
					amenity: 'dentist',
				}],
			},
			doctors: {
				title: 'Orvosi rendelő',
				overpassQuery: [{
					amenity: 'doctors',
				}],
			},
			pharmacy: {
				title: 'Gyógyszertár',
				overpassQuery: [{
					amenity: 'pharmacy',
				}],
			},
			veterinary: {
				title: 'Állatorvos',
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
				overpassQuery: [{
					amenity: 'place_of_worship',
				}],
			},
			cinema: {
				title: 'Mozi',
				overpassQuery: [{
					amenity: 'cinema',
				}],
			},
			community_centre: {
				title: 'Művelődési központ',
				overpassQuery: [{
					amenity: 'community_centre',
				}],
			},
			library: {
				title: 'Könyvtár',
				overpassQuery: [{
					amenity: 'library',
				}],
			},
			museum: {
				title: 'Múzeum',
				overpassQuery: [{
					tourism: 'museum',
				}],
			},
			theatre: {
				title: 'Színház',
				overpassQuery: [{
					amenity: 'theatre',
				}],
			},
			park: {
				title: 'Park',
				overpassQuery: [{
					leisure: 'park',
				}],
			},
			playground: {
				title: 'Játszótér',
				overpassQuery: [{
					leisure: 'playground',
				}],
			},
			sports_centre: {
				title: 'Sportpálya',
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
				overpassQuery: [{
					leisure: 'beach_resort',
				}],
			},
			water_park: {
				title: 'Élményfürdő',
				overpassQuery: [{
					leisure: 'water_park',
				}],
			},
			natural_beach: {
				title: 'Vízparti strand',
				overpassQuery: [{
					natural: 'beach',
				}],
			},
			swimming: {
				title: 'Uszoda',
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
				overpassQuery: [{
					amenity: 'kindergarten',
				}],
			},
			school: {
				title: 'Iskola',
				overpassQuery: [{
					amenity: 'school',
				}],
			},
			university: {
				title: 'Egyetem',
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
				overpassQuery: [{
					amenity: 'fuel',
				}],
			},
			parking: {
				title: 'Parkoló',
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
				overpassQuery: [{
					amenity: 'drinking_water',
				}],
			},
			toilets: {
				title: 'Nyilvános WC',
				alternativeSearchText: ['Illemhely'],
				overpassQuery: [{
					amenity: 'toilets',
				}],
			},
			recycling: {
				title: 'Szelektív hulladékgyűjtő',
				overpassQuery: [{
					amenity: 'recycling',
				}],
			},
		},
	},
};
