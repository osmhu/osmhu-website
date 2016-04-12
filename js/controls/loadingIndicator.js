var L = require('leaflet');

var LoadingIndicator = L.Control.extend({
	options: {
		position: 'topleft'
	},
	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-control-loading-indicator leaflet-bar leaflet-control');

		container.innerHTML = '<img src="/kepek/ajax-loader.gif"><span>Betöltés</span>';

		return container;
	}
});

module.exports = LoadingIndicator;
