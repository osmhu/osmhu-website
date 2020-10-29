/* globals window */

const $ = require('jquery');
const Coordinates = require('coordinate-parser');

const MobileDetector = require('./MobileDetector');
const NominatimResult = require('./search/NominatimResult');
const Marker = require('./marker/Marker');

const nominatimUrl = 'https://nominatim.openstreetmap.org/search';

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
		q: text,
		format: 'json',
		limit: limit,
		email: email,
		viewbox: viewbox,
		addressdetails: 1,
		'accept-language': 'hu',
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
	const { primaryName, surroundingArea } = NominatimResult.niceNameFromResult(result);

	var row = '';
	row+= '<div class="result">';
	row+= '<a onclick="searchDetails(';
	row+= "'" + result.osm_type + "'" + ', ';
	row+= "'" + result.osm_id + "'";
	row+= ');">';
	if (result.icon) {
		row+= '<span class="icon">';
		row+= '<img src="' + result.icon + '">';
		row+= '</span>';
	}
	row+= primaryName;
	if (surroundingArea.length > 0) {
		row+= ' - ' + surroundingArea.join(' - ');
	}
	row+= '</a>';
	row+= '</div>';
	return row;
};

search.convertToLatLon = (string) => {
	const coordinates = new Coordinates(string);

	return {
		lat: coordinates.getLatitude(),
		lon: coordinates.getLongitude(),
	};
};

search.focusIfCoordinates = (query) => {
	try {
		const { lat, lon } = search.convertToLatLon(query.trim());

		window.map.setView([lat, lon], 14);

		return true;
	} catch (error) {
		return false;
	}
};

var visibleSearchResult;

search.details = async (type, id) => {
	if (visibleSearchResult) {
		map.removeLayer(visibleSearchResult);
		visibleSearchResult = null;
	}

	if (MobileDetector.isMobile()) {
		searchResults.hide(200);
	}
	$('body').addClass('loading');

	visibleSearchResult = await Marker.fromTypeAndId(type, id, map);
	$('body').removeClass('loading');
};
