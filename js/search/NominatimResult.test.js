const NominatimResult = require('./NominatimResult');

test('should only return country name for countries', () => {
	const hungary = {
		display_name: 'Magyarország',
		class: 'boundary',
		type: 'administrative',
		address: {
			country: 'Magyarország',
			country_code: 'hu',
		},
	};

	expect(NominatimResult.niceNameFromResult(hungary)).toEqual({
		primaryName: 'Magyarország',
		surroundingArea: [],
	});

	const france = {
		display_name: 'Franciaország',
		class: 'boundary',
		type: 'administrative',
		address: {
			country: 'Franciaország',
			country_code: 'fr',
		},
	};

	expect(NominatimResult.niceNameFromResult(france)).toEqual({
		primaryName: 'Franciaország',
		surroundingArea: [],
	});
});

test('should generate nice name for Budapest', () => {
	const budapest = {
		display_name: 'Budapest, Közép-Magyarország, Magyarország',
		class: 'place',
		type: 'city',
		address: {
			city: 'Budapest',
			country: 'Magyarország',
			country_code: 'hu',
			region: 'Közép-Magyarország',
		},
	};

	expect(NominatimResult.niceNameFromResult(budapest)).toEqual({
		primaryName: 'Budapest',
		surroundingArea: [],
	});
});

test('should generate nice name for non-Budapest city', () => {
	const kecskemet = {
		display_name: 'Kecskemét, Kecskeméti járás, Bács-Kiskun megye, Dél-Alföld, Alföld és Észak, Magyarország',
		class: 'place',
		type: 'city',
		address: {
			city: 'Kecskemét',
			country: 'Magyarország',
			country_code: 'hu',
			county: 'Bács-Kiskun megye',
			region: 'Alföld és Észak',
		},
	};

	expect(NominatimResult.niceNameFromResult(kecskemet)).toEqual({
		primaryName: 'Kecskemét',
		surroundingArea: ['Bács-Kiskun megye'],
	});
});

test('should generate nice name for administrative areas', () => {
	const administrativeArea = {
		display_name: 'Eger, Egri járás, Heves megye, Észak-Magyarország, Alföld és Észak, Magyarország',
		class: 'boundary',
		type: 'administrative',
		address: {
			city: 'Eger',
			country: 'Magyarország',
			country_code: 'hu',
			county: 'Heves megye',
			region: 'Alföld és Észak',
		},
	};

	expect(NominatimResult.niceNameFromResult(administrativeArea)).toEqual({
		primaryName: 'Eger',
		surroundingArea: ['Heves megye'],
	});
});

test('should generate nice name for Budapest street result', () => {
	const budapestStreet = {
		display_name: 'Ostrom utca, Víziváros, I. kerület, Budapest, Közép-Magyarország, 1015, Magyarország',
		class: 'highway',
		type: 'residential',
		address: {
			road: 'Ostrom utca',
			suburb: 'Víziváros',
			city_district: 'I. kerület',
			city: 'Budapest',
			postcode: '1015',
			region: 'Közép-Magyarország',
			country: 'Magyarország',
			country_code: 'hu',
		},
	};

	expect(NominatimResult.niceNameFromResult(budapestStreet)).toEqual({
		primaryName: 'Ostrom utca',
		surroundingArea: ['I. kerület', 'Budapest'],
	});
});

test('should generate nice name for non-Budapest street results', () => {
	const nonBudapestStreet = {
		display_name: 'Ostrom utca, Almagyar, Eger, Egri járás, Heves megye, Észak-Magyarország, Alföld és Észak, 3300, Magyarország',
		class: 'highway',
		type: 'residential',
		address: {
			road: 'Ostrom utca',
			suburb: 'Almagyar',
			town: 'Eger',
			postcode: '3300',
			county: 'Heves megye',
			region: 'Alföld és Észak',
			country: 'Magyarország',
			country_code: 'hu',
		},
	};

	expect(NominatimResult.niceNameFromResult(nonBudapestStreet)).toEqual({
		primaryName: 'Ostrom utca',
		surroundingArea: ['Eger', 'Heves megye'],
	});
});

test('should generate nice name for foreign street results', () => {
	const foreignStreet = {
		display_name: 'Ostrom utca, Várad-Velence, Nagyvárad, Bihar megye, 410169, Románia',
		class: 'highway',
		type: 'residential',
		address: {
			road: 'Ostrom utca',
			suburb: 'Várad-Velence',
			city: 'Nagyvárad',
			postcode: '410169',
			county: 'Bihar megye',
			country: 'Románia',
			country_code: 'ro',
		},
	};

	expect(NominatimResult.niceNameFromResult(foreignStreet)).toEqual({
		primaryName: 'Ostrom utca',
		surroundingArea: ['Nagyvárad', 'Románia'],
	});
});

test('should generate nice name for non-Budapest footway results', () => {
	const nonBudapestFootway = {
		display_name: 'Ostrom utca, Csákvár, Bicskei járás, Fejér megye, Közép-Dunántúl, Dunántúl, 8083, Magyarország',
		class: 'highway',
		type: 'footway',
		address: {
			footway: 'Ostrom utca',
			town: 'Csákvár',
			postcode: '8083',
			county: 'Fejér megye',
			region: 'Dunántúl',
			country: 'Magyarország',
			country_code: 'hu',
		},
	};

	expect(NominatimResult.niceNameFromResult(nonBudapestFootway)).toEqual({
		primaryName: 'Ostrom utca',
		surroundingArea: ['Csákvár', 'Fejér megye'],
	});
});

test('should generate nice name for street with housenumber', () => {
	const streetWithHouseNumber = {
		display_name: '6, Ostrom utca, Víziváros, I. kerület, Budapest, Közép-Magyarország, 1015, Magyarország',
		class: 'place',
		type: 'house',
		address: {
			road: 'Ostrom utca',
			house_number: '6',
			city_district: 'I. kerület',
			suburb: 'Víziváros',
			city: 'Budapest',
			postcode: '1015',
			region: 'Közép-Magyarország',
			country: 'Magyarország',
			country_code: 'hu',
		},
	};

	expect(NominatimResult.niceNameFromResult(streetWithHouseNumber)).toEqual({
		primaryName: 'Ostrom utca 6',
		surroundingArea: ['I. kerület', 'Budapest'],
	});
});

test('should generate nice name for entrance with housenumber and street', () => {
	const entranceWithHouseNumber = {
		display_name: '51, Péterfy Sándor utca, Erzsébetváros, VII. kerület, Budapest, Közép-Magyarország, 1076, Magyarország',
		class: 'building',
		type: 'yes',
		address: {
			city: 'Budapest',
			city_district: 'VII. kerület',
			country: 'Magyarország',
			country_code: 'hu',
			house_number: '51',
			postcode: '1076',
			region: 'Közép-Magyarország',
			road: 'Péterfy Sándor utca',
			suburb: 'Erzsébetváros',
		},
	};

	expect(NominatimResult.niceNameFromResult(entranceWithHouseNumber)).toEqual({
		primaryName: 'Péterfy Sándor utca 51',
		surroundingArea: ['VII. kerület', 'Budapest'],
	});
});

test('should generate nice name for village street', () => {
	const villageStreet = {
		display_name: 'Szabadság tér, Mikepércs, Derecskei járás, Hajdú-Bihar megye, Észak-Alföld, Alföld és Észak, 4271, Magyarország',
		class: 'highway',
		type: 'residential',
		address: {
			country: 'Magyarország',
			country_code: 'hu',
			county: 'Hajdú-Bihar megye',
			postcode: '4271',
			region: 'Alföld és Észak',
			road: 'Szabadság tér',
			village: 'Mikepércs',
		},
	};

	expect(NominatimResult.niceNameFromResult(villageStreet)).toEqual({
		primaryName: 'Szabadság tér',
		surroundingArea: ['Mikepércs', 'Hajdú-Bihar megye'],
	});
});

test('should use first part of displayname if differs from address', () => {
	const eastStation = {
		display_name: 'Keleti pályaudvar, 1, Baross tér, Kerepesdűlő, Budapest, Közép-Magyarország, 1087, Magyarország',
		class: 'building',
		type: 'train_station',
		address: {
			building: 'Keleti pályaudvar',
			city: 'Budapest',
			country: 'Magyarország',
			country_code: 'hu',
			house_number: '1',
			postcode: '1087',
			region: 'Közép-Magyarország',
			road: 'Baross tér',
			suburb: 'Kerepesdűlő',
		},
	};

	expect(NominatimResult.niceNameFromResult(eastStation)).toEqual({
		primaryName: 'Keleti pályaudvar',
		surroundingArea: ['Budapest'],
	});
});

test('should use first part of displayname when city exists', () => {
	const parkany = {
		display_name: 'Párkány, Érsekújvári járás, Nyitrai kerület, Nyugat-Szlovákia, Szlovákia',
		class: 'boundary',
		type: 'administrative',
		address: {
			city: 'Érsekújvári járás',
			city_district: 'Párkány',
			country: 'Szlovákia',
			country_code: 'sk',
			region: 'Nyugat-Szlovákia',
			state: 'Nyitrai kerület',
		},
	};

	expect(NominatimResult.niceNameFromResult(parkany)).toEqual({
		primaryName: 'Párkány',
		surroundingArea: ['Szlovákia'],
	});
});

test('should use first part of displayname as primary name if village is found', () => {
	const balatonVillage = {
		display_name: 'Balaton, Bélapátfalvai járás, Heves megye, Észak-Magyarország, Alföld és Észak, 3347, Magyarország',
		class: 'boundary',
		type: 'administrative',
		address: {
			country: 'Magyarország',
			country_code: 'hu',
			county: 'Heves megye',
			municipality: 'Bélapátfalvai járás',
			postcode: '3347',
			region: 'Észak-Magyarország',
			village: 'Balaton',
		},
	};

	expect(NominatimResult.niceNameFromResult(balatonVillage)).toEqual({
		primaryName: 'Balaton',
		surroundingArea: ['Heves megye'],
	});
});

test('should use first part of displayname as primary name if cannot determine otherwise', () => {
	const dwelling = {
		display_name: 'Viktória Fogadó, Inárcs, Dabasi járás, Pest megye, Közép-Magyarország, Magyarország',
		class: 'place',
		type: 'isolated_dwelling',
		address: {
			country: 'Magyarország',
			country_code: 'hu',
			county: 'Pest megye',
			region: 'Közép-Magyarország',
			suburb: 'Viktória Fogadó',
			village: 'Inárcs',
		},
	};

	expect(NominatimResult.niceNameFromResult(dwelling)).toEqual({
		primaryName: 'Viktória Fogadó',
		surroundingArea: ['Inárcs', 'Pest megye'],
	});
});
