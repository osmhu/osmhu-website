/* global document, window */

const L = require('leaflet');
const log = require('loglevel');

// Creates L.control.locate function
require('leaflet.locatecontrol'); // eslint-disable-line import/no-unassigned-import

const MapControl = require('../../controls/MapControl');

function navigateToHttps() {
	document.location.replace(`https:${document.location.href.substring(document.location.protocol.length)}`);
}

module.exports = class LocateControl extends MapControl {
	constructor() {
		const locateControl = L.control.locate({
			drawCircle: false,
			flyTo: true,
			icon: 'fa fa-location-arrow',
			onLocationError: (error) => {
				const isNotUsingHttps = document.location.protocol !== 'https:';

				if (isNotUsingHttps) {
					if (error.message === 'Geolocation error: Only secure origins are allowed (see: https://goo.gl/Y0ZkNV)..') { // Chrome
						navigateToHttps();
					} else if (error.message === 'Geolocation error: User denied geolocation prompt.') { // Firefox
						const answeredYes = window.confirm('Pozíció meghatározása csak a HTTPS változaton működik.\nÁtirányítsuk?'); // eslint-disable-line no-alert
						if (answeredYes) {
							navigateToHttps();
						}
					} else {
						log.error('Error getting location', error);
					}
				} else {
					log.error('Error getting location', error);
				}
			},
			strings: {
				title: 'Pozíció meghatározása', // title of the locate control
				popup: 'Ennek a pontnak a {distance} méteres körzetében vagy', // text to appear if user clicks on circle
				outsideMapBoundsMsg: 'Úgy tűnik a látható területen kívül vagy', // default message for onLocationOutsideMapBounds
			},
		});

		super(locateControl);
	}
};
