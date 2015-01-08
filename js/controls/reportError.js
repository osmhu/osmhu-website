var L = require('leaflet');

function onClick () {}

var ReportError = L.Control.extend({
	options: {
		position: 'bottomright'
	},
	onAdd: function (map) {
		var container = L.DomUtil.create('div', 'leaflet-control-reportError leaflet-bar leaflet-control');
		
		var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
		link.href = '#';
		link.innerHTML = '<span class="icon"></span><span class="text">Hiba bejelentése</span>';

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
		return new ReportError();
	}
};
