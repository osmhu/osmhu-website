const L = require('leaflet');

const MapControl = require('./MapControl');

// Creates L.easyButton
require('leaflet-easybutton'); // eslint-disable-line import/no-unassigned-import

module.exports = class ReportErrorControl extends MapControl {
	constructor() {
		const markerCreatorControl = L.easyButton({
			id: 'report-error-control',
			position: 'bottomright',
			states: [{
				icon: '<span class="icon"></span><span class="text">Hiba bejelentése</span>',
				onClick: () => { throw new Error('Not implemented'); },
			}],
		});

		super(markerCreatorControl);
	}
};
