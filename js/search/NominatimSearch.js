import Ajax from '../common/Ajax';
import Map from '../map/Map';

import CoordinateSearch from './CoordinateSearch';
import NominatimResult from './NominatimResult';
import SearchResults from './SearchResults';

const nominatimUrl = 'https://nominatim.openstreetmap.org/search';
const resultLimit = 50;
const contactEmail = 'info@openstreetmap.hu'; // Advised at https://nominatim.org/release-docs/latest/api/Search/#other

export default class NominatimSearch {
	constructor(map, searchResults) {
		if (!(map instanceof Map)) {
			throw new Error('map must be instanceof Map');
		}
		this.map = map;
		if (!(searchResults instanceof SearchResults)) {
			throw new Error('searchResults must be instanceof SearchResults');
		}
		this.searchResults = searchResults;
	}

	async search(searchTerm) {
		CoordinateSearch.focusMapIfCoordinates(this.map, searchTerm);

		const trimmedSearchTerm = searchTerm.trim();
		if (trimmedSearchTerm.length === 0) return;

		const nominatimQuery = {
			q: trimmedSearchTerm,
			format: 'json',
			limit: resultLimit,
			email: contactEmail,
			viewbox: NominatimSearch.viewboxInNominatimQueryFormat(this.map),
			addressdetails: 1,
			'accept-language': 'hu',
		};

		const nominatimResults = await Ajax.getWithParams(nominatimUrl, nominatimQuery);

		const searchResults = [];

		nominatimResults.forEach((nominatimResult) => {
			searchResults.push(NominatimResult.convertToSearchResult(nominatimResult));
		});

		this.searchResults.showResults(searchResults);
	}

	static viewboxInNominatimQueryFormat(map) {
		const bounds = map.getBounds();
		const viewbox = [
			bounds.getWest(),
			bounds.getNorth(),
			bounds.getEast(),
			bounds.getSouth(),
		].join(',');

		return viewbox;
	}
}
