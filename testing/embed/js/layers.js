var layers = module.exports = {};

var attribution = '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap közreműködők</a>';

/**
 * Default mapnik tiles from http://www.openstreetmap.org
 */
layers.mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom:      19,
	subdomains:   'abc',
	attribution:  attribution,
	detectRetina: true
});

/**
 * OpenCycleMap tiles from http://www.opencyclemap.org/
 */
layers.cycleMap = L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
	layerId:      'C',
	maxZoom:      18,
	subdomains:   'abc',
	attribution:  attribution,
	detectRetina: true
});

/**
 * MapQuest tiles from http://open.mapquest.com/
 */
layers.mapquest = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
	layerId:      'Q',
	maxZoom:      18,
	subdomains:   '1234',
	attribution:  attribution,
	detectRetina: true
});

/**
 * Transport tiles from http://www.thunderforest.com/transport/ (url from Opencyclemap)
 */
layers.transport = L.tileLayer('http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {
	layerId:      'T',
	maxZoom:      18,
	subdomains:   'abc',
	attribution:  attribution,
	detectRetina: true
});

/**
 * Humanitarian tiles from http://hot.openstreetmap.org/ (url from OpenStreetmap.org)
 */
layers.humanitarian = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	layerId:      'H',
	maxZoom:      20,
	subdomains:   'abc',
	attribution:  attribution,
	detectRetina: true
});

layers.getById = function (layerId) {
	switch (layerId) {
		case 'C':
			return layers.cycleMap;
		case 'Q':
			return layers.mapquest;
		case 'T':
			return layers.transport;
		case 'H':
			return layers.humanitarian;
		default:
			return layers.mapnik;
	}
};
