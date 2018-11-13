const L = require('leaflet');

// Creates L.control.locate function
require('leaflet.locatecontrol'); // eslint-disable-line import/no-unassigned-import

const MapControl = require('../../controls/MapControl');

module.exports = class LocateControl extends MapControl {
	constructor() {
		const locateControl = L.control.locate({
			drawCircle: false,
			flyTo: true,
			icon: 'fa fa-location-arrow',
			strings: {
				title: 'Pozíció meghatározása', // title of the locate control
				popup: 'Ennek a pontnak a {distance} méteres körzetében vagy', // text to appear if user clicks on circle
				outsideMapBoundsMsg: 'Úgy tűnik a látható területen kívül vagy', // default message for onLocationOutsideMapBounds
			},
		});

		super(locateControl);
	}
};
