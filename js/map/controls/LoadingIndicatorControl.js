import L from 'leaflet';

import MapControl from './MapControl';

const LoadingIndicator = L.Control.extend({
	options: {
		position: 'topleft',
	},
	onAdd: () => {
		const container = L.DomUtil.create('div', 'leaflet-control-loading-indicator leaflet-bar leaflet-control');

		const loadingIcon = '<img src="/kepek/ajax-loader.gif" width="16" height="16" alt="Betöltés folyamatban" />';
		const loadingMessage = '<span>Betöltés</span>';
		container.innerHTML = loadingIcon + loadingMessage;

		return container;
	},
});

export default class LoadingIndicatorControl extends MapControl {
	constructor() {
		const loadingIndicator = new LoadingIndicator();
		super(loadingIndicator);
	}
}
