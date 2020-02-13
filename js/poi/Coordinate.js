const L = require('leaflet');

module.exports = class Coordinate {
	static getBoundsFromOverpassResult(overpassResult) {
		let bounds;

		switch (overpassResult.type) {
		case 'node': {
			const nodePosition = new L.LatLng(overpassResult.lat, overpassResult.lon);
			bounds = L.latLngBounds(nodePosition, nodePosition);
			break;
		}
		case 'way':
		case 'relation': {
			const southWest = new L.LatLng(overpassResult.bounds.minlat, overpassResult.bounds.minlon);
			const northEast = new L.LatLng(overpassResult.bounds.maxlat, overpassResult.bounds.maxlon);
			bounds = L.latLngBounds(southWest, northEast);
			break;
		}
		default: {
			throw new Error('Unknown overpass result type (should be node, way or relation)');
		}
		}

		return bounds;
	}

	static getCenterFromBounds(bounds) {
		if (!(bounds instanceof L.LatLngBounds)) {
			throw new Error('Bounds parameter should be instance of L.LatLngBounds');
		}

		const centerLat = (bounds.getSouthWest().lat + bounds.getNorthEast().lat) / 2;
		const centerLng = (bounds.getSouthWest().lng + bounds.getNorthEast().lng) / 2;
		const center = new L.LatLng(centerLat, centerLng);
		return center;
	}

	static getCenterPositionOfOverpassResult(overpassResult) {
		let center;

		switch (overpassResult.type) {
		case 'node':
		case 'way': {
			const bounds = Coordinate.getBoundsFromOverpassResult(overpassResult);
			center = Coordinate.getCenterFromBounds(bounds);
			break;
		}
		case 'relation': {
			let hasAdminCentre;
			Object.values(overpassResult.members).forEach((member) => {
				const isNode = member.type === 'node';
				const isAdminCentre = member.role === 'admin_centre';
				const hasCoordinates = member.lat && member.lon;
				if (isNode && isAdminCentre && hasCoordinates) {
					hasAdminCentre = true;
					center = new L.LatLng(member.lat, member.lon);
				}
			});

			if (!hasAdminCentre) {
				const bounds = Coordinate.getBoundsFromOverpassResult(overpassResult);
				center = Coordinate.getCenterFromBounds(bounds);
			}
			break;
		}
		default: {
			throw new Error('Unknown overpass result type (should be node, way or relation)');
		}
		}

		return center;
	}
};
