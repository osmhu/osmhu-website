var $ = require('jquery');

var EmbedCreator = {};

//var domain = 'http://www.openstreetmap.hu';
var domain = 'http://osmhu.lan';

EmbedCreator.generateHTML = function (options) {
	var url = EmbedCreator.generateUrl(options);
	var html = '<iframe src="' + url + '" width="560" height="315" frameborder="0" framespacing="0"></iframe>';
	return html;
};

EmbedCreator.preview = function (activeMarker, map, activeBaseLayer) {
	var name = $('#name').val();
	var address = $('#address').val();
	var latlon;
	if (activeMarker) {
		latlon = activeMarker.getLatLng();
	} else {
		latlon = { lat: 47.17, lng: 19.49 };
	}
	var lat = latlon.lat;
	var lon = latlon.lng;
	var zoom = map.getZoom();

	var html = EmbedCreator.generateHTML({
		name:    name,
		address: address,
		lat:     lat,
		lon:     lon,
		zoom:    zoom,
		layer:   activeBaseLayer
	});

	$('#html-preview').html(html);
};

EmbedCreator.generateUrl = function (options) {
	var name = options.name || '';
	var address = options.address || '';
	var lat = options.lat || '';
	var lon = options.lon || '';
	var zoom = options.zoom || '';
	var layer = options.layer || '';

	var params = [];

	if (name.length > 0) {
		name = encodeURIComponent(name);
		params.push('name=' + name);
	}

	if (address.length > 0) {
		address = encodeURIComponent(address);
		params.push('address=' + address);
	}

	if (lat) {
		params.push('lat=' + lat);
	}

	if (lon) {
		params.push('lon=' + lon);
	}

	if (zoom) {
		params.push('zoom=' + zoom);
	}

	if (layer.length > 0) {
		params.push('layer=' + layer);
	}

	return domain + '/testing/embed/public/embed.html?' + params.join('&');
};

module.exports = EmbedCreator;
