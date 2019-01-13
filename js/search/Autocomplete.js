/* globals map */

const axios = require('axios');
const autocompleteJs = require('autocomplete.js');

const overpass = require('../overpass');
const helpers = require('../helpers');

module.exports = class Autocomplete {
	constructor(fieldSelector) {
		this.fieldSelector = fieldSelector;
		this.initializeField();
	}

	initializeField() {
		this.field = autocompleteJs(this.fieldSelector, { debug: false }, [
			{ source: Autocomplete.querySearch },
		]);
		this.field.on('autocomplete:selected', Autocomplete.resultSelected);
	}

	static resultSelected(event, selectedItem) {
		if (!selectedItem || !selectedItem.value) return;

		const citySelected = selectedItem.value.indexOf(',') === -1;
		if (citySelected) {
			const searchField = event.target;
			searchField.value = `${selectedItem.value}, `;
			Autocomplete.focusCity(selectedItem.value);
		} else {
			Autocomplete.focusStreet(selectedItem.id);
		}
	}

	static async querySearch(query, cb) {
		const { city, street } = Autocomplete.splitQuery(query);

		let results;
		if (typeof street !== 'undefined') {
			results = await Autocomplete.searchStreet(city, street);
		} else {
			results = await Autocomplete.searchCity(city);
		}
		cb(results);
	}

	static async searchCity(city) {
		const cityTerm = city.trim();

		const resultCities = await Autocomplete.queryAutocompleteApi('query/cities.php', { term: cityTerm });

		if (!Array.isArray(resultCities)) {
			throw new Error('Wrong response from query/cities.php: ' + resultCities);
		}

		return resultCities.map(resultCity => ({ value: resultCity }));
	}

	static async searchStreet(city, street) {
		if (typeof city === 'undefined' || typeof street === 'undefined') return true;

		const cityTerm = city.trim();
		const streetTerm = street.trim();
		const niceCityName = Autocomplete.niceCityName(cityTerm);

		const resultStreets = await Autocomplete.queryAutocompleteApi('/query/streets.php', { city: cityTerm, term: streetTerm });

		if (!Array.isArray(resultStreets)) {
			throw new Error('Wrong response from query/streets.php: ' + resultStreets);
		}

		return resultStreets.map(resultStreet => ({
			id: resultStreet.id,
			value: `${niceCityName}, ${resultStreet.name}`,
		}));
	}

	static async queryAutocompleteApi(url, params) {
		let response;
		try {
			response = await axios.get(url, { params });

			const result = response.data;

			if (!result.length || result.length === 0) {
				return [];
			}

			return result;
		} catch (error) {
			throw new Error('Autocomplete query error: ' + error + '. Response: ' + response.data);
		}
	}

	static async focusCity(city) {
		const response = await axios.get('/query/coordinates.php', { params: { name: city } });

		const coordinates = response.data;

		const validLat = Object.hasOwnProperty.call(coordinates, 'lat') && coordinates.lat !== null;
		const validLon = Object.hasOwnProperty.call(coordinates, 'lon') && coordinates.lon !== null;

		if (validLat && validLon) {
			map.setView([coordinates.lat, coordinates.lon], 14);
		}
	}

	static async focusStreet(id) {
		const street = await overpass.getDetailsByTypeAndId('way', id);

		if (street.elements.length === 0) return;

		const way = helpers.findElementById(id, street.elements);
		const position = helpers.getCenterPosition(way, street.elements);
		if (position) {
			map.fitBounds(position.bounds, { maxZoom: 18 });
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
};
