const L = require('leaflet');

const MapControl = require('./MapControl');

// Creates L.easyButton
require('leaflet-easybutton'); // eslint-disable-line import/no-unassigned-import

module.exports = class MarkerCreatorControl extends MapControl {
	constructor(share) {
		const markerCreatorControl = L.easyButton({
			states: [{
				icon: '<img src="/kepek/share-icon.png" alt="Hely küldése" width="24" height="24">',
				onClick: share.toggle.bind(share),
				title: 'Hely küldése',
			}],
		});

		super(markerCreatorControl);
	}
};
