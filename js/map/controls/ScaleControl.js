const L = require('leaflet');

const MapControl = require('./MapControl');

module.exports = class LocateControl extends MapControl {
	constructor() {
		const scaleControl = L.control.scale({
			maxWidth: 200,
			imperial: false,
		});

		super(scaleControl);
	}
};
