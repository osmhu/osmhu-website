import Coordinates from 'coordinate-parser';

export default class CoordinateSearch {
	static focusMapIfCoordinates(map, searchTerm) {
		try {
			const { lat, lon } = CoordinateSearch.convertToLatLon(searchTerm);

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
}
