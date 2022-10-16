import L from 'leaflet';

import MapControl from './MapControl';

export default class MarkerCreatorControl extends MapControl {
	constructor(share) {
		const MarkerCreatorControlClass = L.Control.extend({
			options: {
				position: 'topleft',
			},
			onAdd() {
				const container = L.DomUtil.create('div', 'leaflet-bar');
				const link = L.DomUtil.create(
					'a',
					'leaflet-bar-part leaflet-bar-part-single leaflet-control-marker-creator',
					container,
				);
				link.innerHTML = '<img src="/kepek/send-location-icon.png" alt="Hely küldése" width="24" height="24" />';
				link.href = '#';
				link.title = 'Hely küldése';

				link.setAttribute('role', 'button');
				link.setAttribute('aria-label', 'Hely küldése');

				L.DomEvent.disableClickPropagation(link);
				L.DomEvent.on(link, 'click', L.DomEvent.stop);
				L.DomEvent.on(link, 'click', share.toggle.bind(share), this);

				return container;
			},
		});

		super(new MarkerCreatorControlClass());
	}
}
