const L = require('leaflet');

const MapControl = require('../../controls/MapControl');

module.exports = class ZoomControl extends MapControl {
	constructor() {
		const zoomControl = L.control.zoom({
			zoomInTitle: 'Nagyítás',
			zoomOutTitle: 'Kicsinyítés',
		});

		super(zoomControl);
	}
};
