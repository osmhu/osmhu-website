const L = require('leaflet');

const MapControl = require('../../controls/MapControl');

const share = require('../../share');

// Creates L.easyButton
require('leaflet-easybutton'); // eslint-disable-line import/no-unassigned-import

module.exports = class MarkerCreatorControl extends MapControl {
	constructor() {
		const markerCreatorControl = L.easyButton({
			states: [{
				icon: '<img src="/kepek/share-icon.png">',
				onClick: share.toggle,
				title: 'Hely küldése',
			}],
		});

		super(markerCreatorControl);
	}
};
