var L = require('leaflet');

function onClick () {}

var MarkerCreator = L.Control.extend({
	options: {
		position: 'topleft'
	},
	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-control-marker leaflet-bar leaflet-control');
		
		var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
		link.href = '#';
		link.title = 'Hely küldése';

		L.DomEvent
			.on(link, 'click', L.DomEvent.stopPropagation)
			.on(link, 'click', L.DomEvent.preventDefault)
			.on(link, 'click', onClick)
			.on(link, 'dblclick', L.DomEvent.stopPropagation);

		return container;
	}
});

module.exports = {
	initialize: function (options) {
		onClick = options.onClick;
		return new MarkerCreator();
	}
};
