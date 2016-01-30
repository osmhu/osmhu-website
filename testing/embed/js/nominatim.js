var $ = require('jquery');

var Nominatim = {};

Nominatim.search = function (address, map, createMarker) {
	var validResults = [];

	// Don't search, when no address is given
	if (address.length === 0) return;

	var nominatimUrl = 'http://nominatim.openstreetmap.org/search';
	var query = {
		q:                 address,
		format:            'json',
		limit:             5,
		email:             'info@openstreetmap.hu',
		countrycodes:      'hu',
		addressdetails:    1,
		'accept-language': 'hu'
	};

	$.getJSON(nominatimUrl, query)
	.done(function (results) {
		Nominatim.searchResults(results);
		var firstResult = results[0];
		createMarker(firstResult.lat, firstResult.lon);

		var boundingBox = [
			[firstResult.boundingbox[0], firstResult.boundingbox[2]],
			[firstResult.boundingbox[1], firstResult.boundingbox[3]]
		];

		map.fitBounds(boundingBox);
		$('#address').removeClass('searching');
	});
};

Nominatim.searchResults = function (results) {
	var html = '';

	for (var i = 0; i < results.length; i++) {
		html+= Nominatim.resultRenderer(results[i]);
	}
	$('#search-results').html(html);
};

// Get container of a nominatim search result
function getContainer (searchResult) {
	var container = '';
	if (searchResult.address.city) {
		container+= searchResult.address.city;
	} else if (searchResult.address.town) {
		container+= searchResult.address.town;
	} else if (searchResult.address.village) {
		container+= searchResult.address.village;
	}

	if (searchResult.address.country !== 'Magyarország') {
		container+= ' - ' + searchResult.address.country;
	}
	return container;
}

/**
 * Get a search result row html
 */
Nominatim.resultRenderer = function (result) {
	var display = [];
	$.each(result.address, function (id, addressPart) {
		// Show if the result has the type of this address part
		var exactMatch = (id === result.type) || (id === 'city_district' && result.type === 'district');

		// Don't show any of these address parts
		var dontShow = ['country_code', 'country', 'state', 'region','county',
						'pedestrian', 'city_district', 'suburb', 'city', 'town',
						'road', 'neighbourhood', 'postcode', 'house_number'];
		var showCurrent = (dontShow.indexOf(id) === -1 || exactMatch);
		if (showCurrent) {
			display.push(addressPart);
		}
	});
	var name = display.join(', ');
	var container = getContainer(result);

	// Special display rule for places
	if (result.class === 'place') {
		if (result.type === 'district') {
			name = result.address.city_district;
		} else {
			name = result.address[result.type];
		}
		if (result.type === 'city') {
			// If not Hungary, show country as container
			container = (result.address.country !== 'Magyarország') ? result.address.country : '';
		}
	// Special display rules for highways
	} else if (result.class === 'highway') {
		// If road, display road as name
		if (result.address.road) {
			name = result.address.road;
		}
	// Special display rules for boundaries
	} else if (result.class === 'boundary') {
		// Display full nominatim string on boundaries
		name = result.display_name;
		container = '';
	}

	var row = '<div class="result" ' +
		'data-boundingbox-0="' + result.boundingbox[0] + '" ' +
		'data-boundingbox-1="' + result.boundingbox[1] + '" ' +
		'data-boundingbox-2="' + result.boundingbox[2] + '" ' +
		'data-boundingbox-3="' + result.boundingbox[3] + '" ' +
		'data-name="' + name + '" ' +
		'data-lat="' + result.lat + '" ' +
		'data-lon="' + result.lon + '">';
	row+= name;
	if (container) {
		row+= ' - ' + container;
	}
	row+= '</div>';
	return row;
};

module.exports = Nominatim;
