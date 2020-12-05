const LayerList = require('./LayerList');
const GeoJsonLayer = require('./GeoJsonLayer');
const TileLayer = require('./TileLayer');

module.exports = class Overlays extends LayerList {
	constructor() {
		const layers = {};

		layers.tourist = new TileLayer(
			'tur',
			'Turistautak',
			'https://{s}.tile.openstreetmap.hu/tt/{z}/{x}/{y}.png',
			19,
		);
		layers.tourist.maxNativeZoom = 17;

		layers.okt = new GeoJsonLayer(
			'okt',
			'Országos Kéktúra',
			'https://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=3020505',
		);

		layers.ddk = new GeoJsonLayer(
			'ddk',
			'Dél-Dunántúli Kéktúra',
			'https://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=289362',
		);

		layers.akt = new GeoJsonLayer(
			'akt',
			'Alföldi Kéktúra',
			'https://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=2164968',
		);

		super(layers);
	}
};
