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
 * Needs registered API key from https://manage.thunderforest.com (currently supports 150,000 tile loads / month)
 */
layers.cycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=b91d55049c50482da2771ab941a3aeb4', {
	layerId:      'C',
	maxZoom:      18,
	subdomains:   'abc',
	attribution:  attribution,
	detectRetina: true
});

/**
 * OpenStreetMap France from http://tile.openstreetmap.fr/
 */
layers.osmfr = L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	layerId:      'F',
	maxZoom:      20,
	subdomains:   'abc',
	attribution:  attribution,
	detectRetina: true
});

/**
 * Transport tiles from http://www.thunderforest.com/transport/
 * Needs registered API key from https://manage.thunderforest.com (currently supports 150,000 tile loads / month)
 */
layers.transport = L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b91d55049c50482da2771ab941a3aeb4', {
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
		case 'F':
			return layers.osmfr;
		case 'T':
			return layers.transport;
		case 'H':
			return layers.humanitarian;
		default:
			return layers.mapnik;
	}
};
