import L from 'leaflet';

import MapControl from './MapControl';

export default class LocateControl extends MapControl {
	constructor() {
		const scaleControl = L.control.scale({
			maxWidth: 200,
			imperial: false,
		});

		super(scaleControl);
	}
}
