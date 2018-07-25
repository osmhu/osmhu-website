var serviceUrls = module.exports = {};

https://wiki.openstreetmap.org/wiki/Overpass_API#Public_Overpass_API_instances
serviceUrls.overpassEndpoints = [
	'https://lz4.overpass-api.de/api/',
	'https://z.overpass-api.de/api/',
	'https://overpass.openstreetmap.fr/api/',
	'https://overpass.kumi.systems/api/',
	/* Unreachable
	'http://overpass.openstreetmap.ru/cgi/'
	*/
];

serviceUrls.nominatimUrl = 'https://nominatim.openstreetmap.org/search';
