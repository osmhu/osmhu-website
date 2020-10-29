const Coordinates = require('coordinate-parser');

module.exports = class NominatimSearch {
	static focusMapIfCoordinates(map, searchTerm) {
		try {
			const { lat, lon } = NominatimSearch.convertToLatLon(searchTerm);

			map.setView([lat, lon], 14);

			return true;
		} catch (error) {
			return false;
		}
	}

	static convertToLatLon(string) {
		const coordinates = new Coordinates(string);

		return {
			lat: coordinates.getLatitude(),
			lon: coordinates.getLongitude(),
		};
	}
};
