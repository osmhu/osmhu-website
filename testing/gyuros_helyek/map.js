$(function () {
	// Initialize map into #map
	window.map = L.map('map');

	// Add Leaflet.Locate control to map
	L.control.locate(osmhu.leaflet.locateOptions).addTo(map);

	// Add scale control to map
	L.control.scale(osmhu.leaflet.scaleOptions).addTo(map);

	// Available layers
	var layers = {
		'Mapnik':   osmhu.layers.mapnik,
		'Mapquest': osmhu.layers.mapquest
	};

	// Create map controls for layers and overlays
	L.control.layers(layers).addTo(map);

	// Add default layer to map on page load
	osmhu.layers.mapquest.addTo(map);

	// Set default view
	map.setView([47.53, 19.06], 14);

	// Use osmhu nominatim search on form submit with custom resultRenderer
	$('form#search').on('submit', function (event) {
		event.preventDefault();

		osmhu.search.nominatim({
			field: $('input#search'),
			resultRenderer: function (result) {
				var html = '<div class="result">';
				html+= '<a onclick="map.setView([' + result.lat + ', ' + result.lon + '], 14);">';
				html+= result.display_name;
				html+= '</a>';
				html+= '</div>';
				return html;
			}
		});
	});

	var customIcon = {
		iconUrl: 'fitness.png',
		iconSize: [32, 37],
		iconAnchor: [16, 36]
	};

	// When the overpass query is done, show the data
	function overpassCallback (data) {
		var elements = data.elements;
		$.each(elements, function (key, element) {
			var position = osmhu.helpers.getCenterPosition(element, elements);
			if (position) {
				if (element.tags['leisure']) {
					var marker = osmhu.marker.fromPoi({
						position: position,
						poi:      element,
						shareUrl: false,
						iconProvider: function () {
							return customIcon;
						}
					});
					overPassLayer.addLayer(marker);
				}
			}
		});
	};

	var query = [ 'node["leisure"="fitness_station"]' ];

	var overpassLayerQuery = osmhu.overpass.generateComplexQuery(query);
	if (overpassLayerQuery) {
		// Add Overpass layer
		window.overPassLayer = new L.OverPassLayer({
			minzoom: 14,
			query: overpassLayerQuery,
			callback: overpassCallback
		}).addTo(map);
	}
});
