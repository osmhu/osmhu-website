import L from 'leaflet';

import MapControl from './MapControl';

const LoadingIndicator = L.Control.extend({
	options: {
		position: 'topleft',
	},
	onAdd: () => {
		const container = L.DomUtil.create('div', 'leaflet-control-loading-indicator leaflet-bar leaflet-control');

		container.innerHTML = '<img src="/kepek/ajax-loader.gif" width="16" height="16"><span>Betöltés</span>';

		return container;
	},
});

export default class LoadingIndicatorControl extends MapControl {
	constructor() {
		const loadingIndicator = new LoadingIndicator();
		super(loadingIndicator);
	}
}
