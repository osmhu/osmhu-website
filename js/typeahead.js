var $ = require('jquery');
window.jQuery = $; // Hack to make typeahead work
require('typeahead.js');

var search = require('./search');

var typeahead = module.exports = $('#search-area input.typeahead').typeahead(null, {
	name:       'cities',
	displayKey: 'name',
	source: function (query, cb) {
		var hasColon = query.indexOf(',') !== -1;
		var hasSpace = query.indexOf(' ') !== -1;
		var isBudapestDistrict = query.toLowerCase().match(/^budapest\ [xiv]+$/);
		if (hasColon || (hasSpace && !isBudapestDistrict)) {
			var parts;
			if (hasColon) {
				parts = query.split(',');
			} else if (hasSpace) {
				parts = query.split(' ');
			}

			search.street(parts[0], parts[1], cb);
		} else {
			search.city(query, cb);
		}
	}
}).on('typeahead:selected', function (event, selected) {
	if (selected.name.indexOf(',') === -1) {
		$(this).val(selected.name + ' ');
		search.focusCity(selected.name);
	} else {
		search.focusStreet(selected.id);
	}
});

// Focus search field on load
typeahead.focus();
