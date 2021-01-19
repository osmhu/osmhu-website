import L from 'leaflet';

import MapControl from './MapControl';

export default class ZoomControl extends MapControl {
	constructor() {
		const zoomControl = L.control.zoom({
			zoomInTitle: 'Nagyítás',
			zoomOutTitle: 'Kicsinyítés',
		});

		super(zoomControl);
	}
}
