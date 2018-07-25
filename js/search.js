var $ = require('jquery');

var helpers = require('./helpers');
var overpass = require('./overpass');
var marker = require('./marker');

var nominatimUrl = require('./config/serviceUrls').nominatimUrl;

var search = module.exports = {};

var searchResults = $('#search-results');

search.nominatim = function (options) {
	var field = options.field;
	var limit = options.limit || 50;
	var email = options.email || 'info@openstreetmap.hu';

	var text = field.val().trim();

	// Don't search, when no term is given
	if (text.length === 0) return;

	field.addClass('searching');

	var bounds = map.getBounds();
	var viewbox = bounds.getWest() + ',' + 
				  bounds.getNorth() + ',' +
				  bounds.getEast() + ',' +
				  bounds.getSouth();

	var query = {
		q:       text,
		format:  'json',
		limit:   limit,
		email:   email,
		viewbox: viewbox,
		addressdetails:    1,
		'accept-language': 'hu'
	};

	$.getJSON(nominatimUrl, query)
	.done(function (results) {
		field.removeClass('searching');

		if (results.length === 0) {
			searchResults.find('.no-results').show();
			searchResults.find('.results').hide();
		} else {
			searchResults.find('.no-results').hide();
			searchResults.find('.results').html('');
			$.each(results, function (i, result) {
				searchResults.find('.results').append(options.resultRenderer(result));
			});
			searchResults.find('.results').show();
		}
		searchResults.show();

		$(window).trigger('search-results-show');
	});
};

searchResults.find('a.close').on('click', function () {
	searchResults.hide();

	$(window).trigger('search-results-hide');
});

/**
 * Get a search result row html
 */
search.resultRenderer = function (result) {
	var display = [];
	$.each(result.address, function (key, value) {
		// Show if the result has the type of this address part
		var exactMatch = (key === result.type) || (key === 'city_district' && result.type === 'district');

		// Don't show any of these address parts
		var dontShow = ['country_code', 'country', 'state', 'region','county',
						'pedestrian', 'city_district', 'suburb', 'city', 'town', 'village',
						'road', 'neighbourhood', 'postcode', 'house_number', 'footway'];
		var showCurrent = (dontShow.indexOf(key) === -1 || exactMatch);
		if (showCurrent) {
			display.push(value);
		}
	});

 	// For street addresses, need to display both road name and house number
	if (result.class === 'building') {
		if (result.address.road && result.address.house_number) {
			var streetAddress = result.address.road + ' ' + result.address.house_number;
			display.unshift(streetAddress);
		}
	}

	var name = display.join(', ');
	var container = getContainer(result);

	var displayNameIndex = 0;
	while (!name || name === container) {
		name = result.display_name.split(', ')[displayNameIndex];
		displayNameIndex++;
	}

	if (result.address.hasOwnProperty(result.type)) {
		// If address info contains same key as result type, than it is the most important information
		name = result.address[result.type];
	} else {
		// Special corner cases
		if (result.class === 'boundary') { // Special display rule for boundaries
			name = result.display_name.split(', ')[0];
			container = result.display_name.split(', ')[1];
		}
	}

	var row = '';
	row+= '<div class="result">';
	row+= '<a onclick="searchDetails(';
	row+= "'" + result.osm_type + "'" + ', ';
	row+= "'" + result.osm_id + "'" + ', [';
	row+= result.boundingbox[0] + ', ';
	row+= result.boundingbox[1] + ', ';
	row+= result.boundingbox[2] + ', ';
	row+= result.boundingbox[3] + '],';
	row+= '{ name: ' + "'" + name + "'" + ', lat: ' + result.lat + ', lon: ' + result.lon + '}';
	row+= ');">';
	if (result.icon) {
		row+= '<span class="icon">';
		row+= '<img src="' + result.icon + '">';
		row+= '</span>';
	}
	row+= name;
	if (container && container !== name) {
		row+= ' - ' + container;
	}
	row+= '</a>';
	row+= '</div>';
	return row;
};

search.city = function (term, cb) {
	term = term.trim();

	$.getJSON('query/cities.php', {
		term: term
	}, function (results) {
		var cityObjects = [];
		$.each(results, function (i, result) {
			cityObjects.push({
				name: result
			});
		});

		cb(cityObjects);
	});
};

search.focusCity = function (city) {
	$.getJSON('/query/coordinates.php', {
		name: city
	}, function (coordinates) {
		if (coordinates.hasOwnProperty('lat') && coordinates.lat !== null &&
			coordinates.hasOwnProperty('lon') && coordinates.lon !== null) {
			map.setView([coordinates.lat, coordinates.lon], 14);
		}
	});
};

search.street = function (city, term, cb) {
	city = city.trim();
	term = term.trim();
	
	var cityNice = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

	$.getJSON('/query/streets.php', {
		city: city,
		term: term
	}, function (results) {
		var streetObjects = [];
		$.each(results, function (i, result) {
			streetObjects.push({
				id:   result.id,
				name: cityNice + ', ' + result.name
			});
		});

		cb(streetObjects);
	});
};

search.focusStreet = function (id) {
	overpass.getDetailsByTypeAndId('way', id)
	.done(function (street) {
		if (street.elements.length === 0) return;

		var way = helpers.findElementById(id, street.elements);
		var position = helpers.getCenterPosition(way, street.elements);
		map.fitBounds(position.bounds, { maxZoom: 18 });
	});
};

search.focusIfCoordinates = function (string) {
	string = string.trim();

	var latLon = string.match(/^\s*([-\d\.]+)[, ]+([-\d\.]+)\s*$/); // 47.7544, 18.5620
	
	if(!latLon) {
		// Lat,Lon with scientific degree units 47° 29′ 53″, 19° 02′ 24″ (seconds optional)
		latLon = string.match(/^\s*([-\d]{1,3})[^\d]+([\d]{1,2})[^\d]+([\d]{0,2})[^\d]+([-\d]{1,3})[^\d]+([\d]{1,2})[^\d]+([\d]{0,2})[^\d]+\s*$/);

		if (latLon) {
			latLon[1] = (Number(latLon[1]) + latLon[2] / 60 + latLon[3] / 3600).toFixed(7);
			latLon[2] = (Number(latLon[4]) + latLon[5] / 60 + latLon[6] / 3600).toFixed(7);
		}
	}

	if (latLon) {
		map.setView([latLon[1], latLon[2]], 14);
	}
};

// Get container of a nominatim search result
function getContainer (searchResult) {
	var container = '';
	if (searchResult.type === 'district') {
		container = searchResult.display_name.split(', ')[1];
	} else if (searchResult.address.city) {
		container = searchResult.address.city;
	} else if (searchResult.address.town) {
		container = searchResult.address.town;
	} else if (searchResult.address.village) {
		container = searchResult.address.village;
	} else if (searchResult.address.hamlet) {
		container = searchResult.address.hamlet;
	} else if (searchResult.address.isolated_dwelling) {
		container = searchResult.address.isolated_dwelling;
	}

	if (searchResult.address.city === 'Budapest' && searchResult.address.hasOwnProperty('city_district')) {
		container = searchResult.address.city_district + ' - ' + container;
	}

	var foreign = searchResult.address.country !== 'Magyarország' && searchResult.address.hasOwnProperty('country');
	if (container.length > 0 && foreign) {
		container+= ' - ';
	}
	if (foreign) {
		container+= searchResult.address.country;
	}
	return container;
}

var visibleSearchResult;


search.details = function (type, id, boundingbox, options) {
	if (visibleSearchResult) {
		map.removeLayer(visibleSearchResult);
		visibleSearchResult = null;
	}

	var zoom = map.getBoundsZoom([
		[ boundingbox[0], boundingbox[2] ],
		[ boundingbox[1], boundingbox[3] ]
	]);

	var isMobile = $(window).width() < 699;
	if (isMobile) {
		searchResults.hide(200);
	}
	$('body').addClass('loading');

	marker.fromTypeAndId(type, id, zoom, {
		fallback: function () {
			var fallbackMarker = L.marker([ options.lat, options.lon ]);
			fallbackMarker.bindPopup('<h2>' + options.name + '</h2>', {
				offset: L.point(0, -24)
			});
			fallbackMarker.addTo(map).openPopup();
			map.setView([ options.lat, options.lon ], zoom, { animate: false });
			$('body').removeClass('loading');
		},
		callback: function (displayedMarker) {
			visibleSearchResult = displayedMarker;
			$('body').removeClass('loading');
		}
	});
};
