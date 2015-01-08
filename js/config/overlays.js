var L = require('leaflet');

var overlays = module.exports = {};

overlays.tourist = L.tileLayer('http://{s}.tile.openstreetmap.hu/tt/{z}/{x}/{y}.png', {
	layerId: 'tur',
	maxZoom: 19,
	maxNativeZoom: 17,
	resolutions: [156543.03390625, 78271.516953125, 39135.7584765625,19567.87923828125, 9783.939619140625, 4891.9698095703125,2445.9849047851562, 1222.9924523925781, 611.4962261962891,305.74811309814453, 152.87405654907226, 76.43702827453613,38.218514137268066, 19.109257068634033, 9.554628534317017,4.777314267158508, 2.388657133579254, 1.194328566789627,0.5971642833948135, 0.25],
	serverResolutions: [156543.03390625, 78271.516953125, 39135.7584765625,19567.87923828125, 9783.939619140625,4891.9698095703125, 2445.9849047851562,1222.9924523925781, 611.4962261962891,305.74811309814453, 152.87405654907226,76.43702827453613, 38.218514137268066,19.109257068634033, 9.554628534317017,4.777314267158508, 2.388657133579254, 1.194328566789627]
});

overlays.okt = L.geoJson(null, {
	layerId: 'okt'
});

overlays.ddk = L.geoJson(null, {
	layerId: 'ddk'
});

overlays.akt = L.geoJson(null, {
	layerId: 'akt'
});

var oktUrl = 'http://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=3020505';
var ddkUrl = 'http://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=289362';
var aktUrl = 'http://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=2164968';

var oktLoaded = false;
var ddkLoaded = false;
var aktLoaded = false;

overlays.ensureGeoJsonLoaded = function (overlayId) {
	switch (overlayId) {
		case 'okt':
			if (!oktLoaded) {
				$.ajax(oktUrl).done(function (geoJson) {
					overlays.okt.addData(geoJson);
					oktLoaded = true;
				});
			}
			break;
		case 'ddk':
			if (!ddkLoaded) {
				$.ajax(ddkUrl).done(function (geoJson) {
					overlays.ddk.addData(geoJson);
					ddkLoaded = true;
				});
			}
			break;
		case 'akt':
			if (!aktLoaded) {
				$.ajax(aktUrl).done(function (geoJson) {
					overlays.akt.addData(geoJson);
					aktLoaded = true;
				});
			}
			break;
		case 'tur':
			break;
		default:
			console.error('No overlay found with id %s', overlayId);
	}
};
