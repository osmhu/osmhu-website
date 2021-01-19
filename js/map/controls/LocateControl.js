/* global document, window */

import L from 'leaflet';
import log from 'loglevel';

import MapControl from './MapControl';

// Creates L.control.locate function
import 'leaflet.locatecontrol';

function navigateToHttps() {
	document.location.replace(`https:${document.location.href.substring(document.location.protocol.length)}`);
}

export default class LocateControl extends MapControl {
	constructor() {
		const locateControl = L.control.locate({
			drawCircle: false,
			flyTo: true,
			icon: 'svg-icon location-arrow-icon',
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
}
