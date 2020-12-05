const L = require('leaflet');

module.exports = class MapControl {
	constructor(control) {
		if (!(control instanceof L.Control)) {
			throw new Error('Control must be an instance of L.Control');
		}
		this.control = control;
	}

	getMapControl() {
		return this.control;
	}
};
