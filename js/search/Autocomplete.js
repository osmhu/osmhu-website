import autocompleteJs from 'autocomplete.js';

import Ajax from '../common/Ajax';

export default class Autocomplete {
	constructor(mapInstance) {
		this.map = mapInstance;
	}

	/* istanbul ignore next */
	initUi(fieldSelector) {
		this.field = autocompleteJs(
			fieldSelector,
			{ debug: false },
			[
				{
					source: async (query, cb) => {
						const results = await Autocomplete.search(query);
						cb(results);
					},
				},
			],
		);

		this.field.on('autocomplete:selected', (event, selectedItem) => {
			if (!selectedItem || !selectedItem.id || !selectedItem.value) return;

			this.processSelection(selectedItem.id, selectedItem.value);
		});
	}

	/* istanbul ignore next */
	setFieldValue(newValue) {
		if (this.field) {
			this.field.value = newValue;
		}
	}

	async processSelection(selectedId, selectedValue) {
		const citySelected = selectedValue.indexOf(',') === -1;
		if (citySelected) {
			const cityName = selectedValue;
			this.setFieldValue(`${cityName}, `);
			const coordinates = await Autocomplete.getCenterCoordinatesByCityName(cityName);
			this.map.setView([coordinates.lat, coordinates.lon], 14);
		} else {
			this.map.focusWay(selectedId);
		}
	}

	static async getCenterCoordinatesByCityName(city) {
		const coordinates = await Ajax.getWithParams('/query/coordinates.php', { name: city });

		const validLat = Object.hasOwnProperty.call(coordinates, 'lat') && coordinates.lat !== null;
		const validLon = Object.hasOwnProperty.call(coordinates, 'lon') && coordinates.lon !== null;

		if (!validLat || !validLon) {
			throw new Error('Invalid coordinates returned for city ' + city);
		}
		return coordinates;
	}

	static async search(query) {
		const { city, street } = Autocomplete.splitQuery(query);

		let results;
		if (typeof street !== 'undefined') {
			results = await Autocomplete.searchStreet(city, street);
		} else {
			results = await Autocomplete.searchCity(city);
		}
		return results;
	}

	static async searchCity(city) {
		const cityTerm = city.trim();

		const resultCities = await Autocomplete.queryAutocompleteApi('/query/cities.php', { term: cityTerm });

		if (!Array.isArray(resultCities)) {
			throw new Error('Wrong response from query/cities.php: ' + resultCities);
		}

		return resultCities.map((resultCity) => ({ value: resultCity }));
	}

	static async searchStreet(city, street) {
		if (typeof city === 'undefined' || typeof street === 'undefined') return true;

		const cityTerm = city.trim();
		const streetTerm = street.trim();

		const resultStreets = await Autocomplete.queryAutocompleteApi('/query/streets.php', { city: cityTerm, term: streetTerm });

		if (!Array.isArray(resultStreets)) {
			throw new Error('Wrong response from query/streets.php: ' + resultStreets);
		}

		const niceCityName = Autocomplete.niceCityName(cityTerm);
		return resultStreets.map((resultStreet) => ({
			id: resultStreet.id,
			value: `${niceCityName}, ${resultStreet.name}`,
		}));
	}

	static async queryAutocompleteApi(url, params) {
		let result;
		try {
			result = await Ajax.getWithParams(url, params);

			if (!result.length) {
				return [];
			}

			return result;
		} catch (error) {
			throw new Error('Autocomplete query error: ' + error.responseText);
		}
	}

	static niceCityName(cityName) {
		let niceName;

		const isBudapestDistrict = cityName.toLowerCase().match(/^budapest [xiv]+/) !== null;
		if (isBudapestDistrict) {
			niceName = `Budapest ${cityName.slice(9)}`;
		} else {
			niceName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
		}

		return niceName;
	}

	static splitQuery(query) {
		const isBudapest = query.toLowerCase() === 'budapest ';
		const isBudapestDistrict = query.toLowerCase().match(/^budapest [xiv]+/) !== null;
		const queryWithoutDistricts = query.toLowerCase().replace(/^budapest [xiv]+/gi, '');
		const hasColon = queryWithoutDistricts.indexOf(',') !== -1;
		const hasSpace = queryWithoutDistricts.indexOf(' ') !== -1;

		let result = {};
		if (hasColon || hasSpace) {
			let parts;
			if (hasColon) {
				parts = query.split(',');
				if (parts[1] && parts[1].charAt(0) === ' ') {
					parts[1] = parts[1].slice(1);
				}
			} else if (isBudapest) {
				parts = ['Budapest'];
			} else if (isBudapestDistrict) {
				parts = query.split('.');
				parts[0] += '.';
				parts[1] = parts[1].slice(1);
			} else {
				parts = query.split(' ');
			}

			result = { city: parts[0], street: parts[1] };
		} else {
			result = { city: query };
		}

		return result;
	}
}
