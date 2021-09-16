import Marker from './Marker';

export default class Markers {
	constructor() {
		this.markers = {};
	}

	add(marker) {
		if (!(marker instanceof Marker)) {
			throw new Error('marker parameter should be instance of Marker');
		}
		const propertyName = marker.osmElementId.toObjectPropertyName();
		this.markers[propertyName] = marker;
	}

	getByOsmElementId(osmElementId) {
		const propertyName = osmElementId.toObjectPropertyName();
		return this.markers[propertyName];
	}

	getAllLeafletMarkers() {
		const leafletMarkers = [];
		Object.values(this.markers).forEach((marker) => {
			leafletMarkers.push(marker.leafletMarker);
		});
		return leafletMarkers;
	}
}
