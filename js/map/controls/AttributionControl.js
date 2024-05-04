import L from 'leaflet';

import MapControl from './MapControl';

export default class AttributionControl extends MapControl {
	constructor() {
		const attributionControl = L.control.attribution({
			prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">Leaflet</a>',
		});

		super(attributionControl);
	}
}
