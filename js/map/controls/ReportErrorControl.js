import L from 'leaflet';

import MapControl from './MapControl';

export default class ReportErrorControl extends MapControl {
	constructor() {
		const ReportErrorControlClass = L.Control.extend({
			options: {
				position: 'bottomright',
			},
			onAdd() {
				const container = L.DomUtil.create('div', 'leaflet-bar');
				const link = L.DomUtil.create('a',
					'leaflet-bar-part leaflet-bar-part-single leaflet-control-report-error', container);
				link.innerHTML = '';
				link.href = '#';
				link.title = 'Hiba bejelentése';

				link.setAttribute('role', 'button');
				link.setAttribute('aria-label', 'Hely küldése');

				L.DomEvent.disableClickPropagation(link);
				L.DomEvent.on(link, 'click', L.DomEvent.stop);
				L.DomEvent.on(link, 'click', () => { throw new Error('Not implemented'); });

				return container;
			},
		});

		super(new ReportErrorControlClass());
	}
}
