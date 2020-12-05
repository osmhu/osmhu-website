const L = require('leaflet');

const MapControl = require('./MapControl');

const LoadingIndicator = L.Control.extend({
	options: {
		position: 'topleft',
	},
	onAdd: () => {
		const container = L.DomUtil.create('div', 'leaflet-control-loading-indicator leaflet-bar leaflet-control');

		container.innerHTML = '<img src="/kepek/ajax-loader.gif"><span>Betöltés</span>';

		return container;
	},
});

module.exports = class LoadingIndicatorControl extends MapControl {
	constructor() {
		const loadingIndicator = new LoadingIndicator();
		super(loadingIndicator);
	}
};
