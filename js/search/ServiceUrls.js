module.exports = class ServiceUrls {
	// Source: https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
	static get overpassEndpoints() {
		return [
			'https://lz4.overpass-api.de/api/',
			'https://z.overpass-api.de/api/',
			'https://overpass.openstreetmap.fr/api/',
			'https://overpass.kumi.systems/api/'
		];
	}

	static get nominatimUrl() {
		return 'https://nominatim.openstreetmap.org/search';
	}
};
