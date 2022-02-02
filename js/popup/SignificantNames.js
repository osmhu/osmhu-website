import log from 'loglevel';

export default class SignificantNames {
	constructor(primaryName, secondaryName) {
		this.primaryName = primaryName || '';
		this.secondaryName = secondaryName || '';
	}

	static generateFromTags(tags) {
		if (!tags) {
			return new SignificantNames();
		}
		let primaryName = '';

		const hungarianName = tags['name:hu'];
		if (tags.name || hungarianName) {
			const hungarianNameDifferent = tags.name !== tags['name:hu'];
			if (hungarianName && hungarianNameDifferent) {
				primaryName = `${tags.name} (${hungarianName})`;
			} else {
				primaryName = tags.name;
			}
		} else if (tags.ref || tags.operator) {
			primaryName = tags.ref || tags.operator;
		}

		let secondaryName = '';
		try {
			secondaryName = SignificantNames.elementType(tags);
		} catch (error) {
			if (error.message === 'Could not determinate element type from tags') {
				// No problem, but probably interesting
				log.debug(error.message, tags);
			} else {
				log.error('Failed to parse type from tags', tags, error);
			}
		}

		if (primaryName.length === 0 && secondaryName.length > 0) {
			primaryName = secondaryName;
			secondaryName = '';
		}

		if (primaryName.length === 0 && secondaryName.length === 0) {
			primaryName = 'Hely';
		}

		return new SignificantNames(primaryName, secondaryName);
	}

	// Ordered by importance
	/* istanbul ignore next */
	static elementType(tags) {
		if (tags.amenity === 'restaurant') return 'Étterem';
		if (tags.amenity === 'fast_food') return 'Gyorsétterem';
		if (tags.amenity === 'cafe') return 'Kávézó';
		if (tags.shop === 'convenience') return 'Kisbolt';
		if (tags.shop === 'supermarket') return 'Bevásárlóközpont';
		if (tags.shop === 'tobacco') return 'Dohánybolt';
		if (tags.shop === 'clothes') return 'Ruházati bolt';
		if (tags.shop === 'bakery') return 'Pékség';
		if (tags.shop === 'hairdresser') return 'Fodrász';
		if (tags.shop === 'car_repair') return 'Autószervíz';
		if (tags.shop === 'florist') return 'Virágbolt';
		if (tags.shop === 'greengrocer') return 'Zöldség-gyümölcs kereskedés';
		if (tags.shop === 'confectionery') return 'Cukrászda';
		if (tags.shop === 'beauty') return 'Szépségszalon';
		if (tags.shop === 'car') return 'Autószalon';
		if (tags.shop === 'chemist') return 'Drogéria';
		if (tags.shop === 'butcher') return 'Húsbolt';
		if (tags.shop === 'bicycle') return 'Kerékpárbolt';
		if (tags.amenity === 'bicycle_rental') return 'Bicikli kölcsönző';
		if (tags.amenity === 'atm') return 'Bankautomata';
		if (tags.amenity === 'bank' && tags.atm === 'yes') return 'Bank + Bankautomata';
		if (tags.amenity === 'bank') return 'Bank';
		if (tags.amenity === 'bureau_de_change') return 'Pénzváltó';
		if (tags.amenity === 'bar') return 'Bár';
		if (tags.amenity === 'pub') return 'Kocsma';
		if (tags.tourism === 'guest_house') return 'Vendégház';
		if (tags.tourism === 'hostel') return 'Turistaszálló';
		if (tags.tourism === 'hotel') return 'Szálloda';
		if (tags.tourism === 'information') return 'Információs pont';
		if (tags.amenity === 'clinic') return 'Klinika';
		if (tags.amenity === 'hospital') return 'Kórház';
		if (tags.amenity === 'dentist') return 'Fogorvos';
		if (tags.amenity === 'doctors') return 'Orvosi rendelő';
		if (tags.amenity === 'pharmacy') return 'Gyógyszertár';
		if (tags.amenity === 'veterinary') return 'Állatorvos';
		if (tags.amenity === 'place_of_worship') return 'Templom';
		if (tags.amenity === 'cinema') return 'Mozi';
		if (tags.amenity === 'community_centre') return 'Művelődési központ';
		if (tags.amenity === 'library') return 'Könyvtár';
		if (tags.tourism === 'museum') return 'Múzeum';
		if (tags.amenity === 'theatre') return 'Színház';
		if (tags.leisure === 'park') return 'Park';
		if (tags.leisure === 'playground') return 'Játszótér';
		if (tags.leisure === 'sports_centre') return 'Sportpálya';
		if (tags.leisure === 'pitch') return 'Sportpálya';
		if (tags.leisure === 'track') return 'Sportpálya';
		if (tags.leisure === 'fitness_station') return 'Fitnesz park';
		if (tags.leisure === 'beach_resort') return 'Strand';
		if (tags.leisure === 'water_park') return 'Élményfürdő';
		if (tags.natural === 'beach') return 'Vízparti strand';
		if (tags.amenity === 'swimming_pool') return 'Uszoda';
		if (tags.amenity === 'kindergarten') return 'Óvoda';
		if (tags.amenity === 'school') return 'Iskola';
		if (tags.amenity === 'university') return 'Egyetem';
		if (tags.amenity === 'fuel') return 'Benzinkút';
		if (tags.amenity === 'parking') return 'Parkoló';
		if (tags.amenity === 'drinking_water') return 'Ivóvíz';
		if (tags.amenity === 'toilets') return 'Nyilvános WC';
		if (tags.amenity === 'recycling') return 'Szelektív hulladékgyűjtő';

		// Train, subway, bus stations
		if (tags.railway === 'station' && tags.subway === 'yes') return 'Metrómegálló';
		if (tags.building === 'train_station' && tags.public_transport === 'station') return 'Vasútállomás';
		if (tags.railway === 'station') return 'Vasútállomás';
		if (tags.amenity === 'bus_station') return 'Buszpályaudvar';
		if (tags.highway === 'bus_stop' || tags.public_transport === 'stop_position') return 'Buszmegálló';

		// Building types
		// Source: https://wiki.openstreetmap.org/wiki/Hu:Key:building?uselang=hu
		// Ordered by frequency in Hungary: https://taginfo.openstreetmap.hu/keys/building
		if (tags.building === 'apartments') return 'Társasház';
		if (tags.building === 'farm') return 'Farm';
		if (tags.building === 'house') return 'Családi ház';
		if (tags.building === 'industrial') return 'Ipari épület';
		if (tags.building === 'church') return 'Templom';
		if (tags.building === 'chapel') return 'Kápolna';
		if (tags.building === 'residential') return 'Lakóház';
		if (tags.building === 'garages') return 'Gárázsok';
		if (tags.building === 'school') return 'Iskolépület';
		if (tags.building === 'commercial') return 'Irodaház';
		if (tags.building === 'retail') return 'Áruház';
		if (tags.building === 'greenhouse') return 'Üvegház';
		if (tags.building === 'yes') return 'Épület';
		// Budapest
		if (tags.name === 'Budapest' && tags.boundary === 'administrative' && tags.admin_level === '8') return 'Főváros';
		// Places
		// Ordered by frequency in Hungary: https://taginfo.openstreetmap.hu/keys/place#values
		if (tags.place === 'locality') return 'Hely';
		if (tags.place === 'village') return 'Falu';
		if (tags.place === 'suburb') return 'Városrész';
		if (tags.place === 'farm') return 'Farm';
		if (tags.place === 'hamlet') return 'Falu';
		if (tags.place === 'neighbourhood') return 'Szomszédság';
		if (tags.place === 'town') return 'Város';
		if (tags.place === 'islet') return 'Sziget';
		if (tags.place === 'island') return 'Sziget';
		if (tags.place === 'county') return 'Megye';
		if (tags.place === 'city') return 'Város';
		if (tags.place === 'district') return 'Kerület';
		// Hungarian administrative rules
		// Source: https://wiki.openstreetmap.org/wiki/Hu:Tag:boundary=administrative?uselang=hu
		if (tags.boundary === 'administrative' && tags.admin_level === '6') return 'Megye';
		if (tags.boundary === 'administrative' && tags.admin_level === '7') return 'Járás';
		if (tags.boundary === 'administrative' && tags.admin_level === '8') return 'Város';
		if (tags.boundary === 'administrative' && tags.admin_level === '9') return 'Kerület';

		// Highways
		if (tags.highway === 'residential') return 'Út';
		if (tags.highway === 'pedestrian') return 'Gyalogos útvonal';

		throw new Error('Could not determinate element type from tags');
	}
}
