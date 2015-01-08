var L = require('leaflet');

var minZoomIdenticator = L.Control.extend({
	options: {
		position: 'topleft'
	},
	_addLayer: function(layer) {
		this._updateBox(null);
	},
	_removeLayer: function(layer) {
        this._updateBox(null);
        // HACK if a layer is deleted, we delete the identicator, only works if there is only one layer
        this.onRemove();
    },
	onAdd: function (map) {
		this._map = map;
		map.zoomIndecator = this;

		this._container = L.DomUtil.create('div', 'leaflet-control-minZoomIdenticator');

		map.on('moveend', this._updateBox, this);
		this._updateBox(null);

		return this._container;
	},
	onRemove: function () {		
		this._container.style.display = 'none';
		this._map.off('moveend', this._updateBox, this);
		map.zoomIndecator = null;
	},
	_updateBox: function (event) {
		if (event !== null) {
			L.DomEvent.preventDefault(event);
		}
		var html = '<img src="/kepek/1391811435_Warning.png">';
			html+= 'A helyek a 14. nagyítási szinttől jelennek meg. ';
			html+= '(Jelenleg: ' + this._map.getZoom() + ')';
		this._container.innerHTML = html;

		if (this._map.getZoom() >= 14) {
			this._container.style.display = 'none';
		} else {
			this._container.style.display = 'block';
		}
	}
});

module.exports = function () {
	return new minZoomIdenticator();
};
