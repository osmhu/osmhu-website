var ZeroClipboard = require('zeroclipboard');
ZeroClipboard.config({
	swfPath: '/node_modules/zeroclipboard/dist/ZeroClipboard.swf'
});

var helpers = module.exports = {};

// Search an element with the given id in a list of elements
helpers.findElementById = function (id, elements) {
	var found = $.grep(elements, function (element) {
		return element.id == id;
	});
	return found[0];
};

// Uppercase first letter
helpers.ucFirst = function (str) {
	if (!str) return;

	return str.charAt(0).toUpperCase() + str.slice(1);
};

helpers.copyButton = function (options) {
	var zcClient = new ZeroClipboard(options.button);
	zcClient.on('aftercopy', options.onCopy);
};

helpers.getCenterPosition = function (element, allElements) {
	var position;
	var bounds;
	switch (element.type) {
		case 'way':
			var wayParts = [];
			$.each(element.nodes, function (i, nodeId) {
				var node = helpers.findElementById(nodeId, allElements);
				wayParts.push(new L.LatLng(node.lat, node.lon));
			});
			var polyline = L.polyline(wayParts, {color: 'red'});
			bounds   = polyline.getBounds();
			position = bounds.getCenter();
			break;
		case 'relation':
			var polygonParts = [];
			var adminCentre = false;
			$.each(element.members, function (i, member) {
				if (member.role === 'admin_centre') {
					adminCentre = helpers.findElementById(member.ref, allElements);
				}
				if (member.type === 'way') {
					var way = helpers.findElementById(member.ref, allElements);
					$.each(way.nodes, function (j, nodeId) {
						var node = helpers.findElementById(nodeId, allElements);
						polygonParts.push(new L.LatLng(node.lat, node.lon));
					});
				} else if (member.type === 'node') {
					var node = helpers.findElementById(member.ref, allElements);
					polygonParts.push(new L.LatLng(node.lat, node.lon));
				}
			});
			var polygon = L.polygon(polygonParts, {color: 'red', fill: true });
			bounds = polygon.getBounds();
			if (adminCentre) {
				position = new L.LatLng(adminCentre.lat, adminCentre.lon);
			} else {
				position = bounds.getCenter();
			}
			break;
		case 'node':
			if (!element.tags) {
				return;
			}
			position = new L.LatLng(element.lat, element.lon);
			break;
		default:
			console.error('Unknown type');
	}

	return {
		center: position,
		bounds: bounds
	};
};
