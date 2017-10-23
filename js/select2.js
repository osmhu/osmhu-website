var L = require('leaflet');
var $ = require('jquery');
window.jQuery = $; // Hack to make select2 work
require('select2');

require('../vendor/leaflet-layer-overpass/dist/OverPassLayer');

var url = require('./url');
var search = require('./search');
var overpass = require('./overpass');
var marker = require('./marker');
var helpers = require('./helpers');
var iconProvider = require('./iconProvider');

var select2 = module.exports = {};

var minimumResultsForSearch = null;
var isMobile = $(window).width() <= 699;
if (isMobile) {
	minimumResultsForSearch = -1;
}

select2.set = function (category) {
	$('#poi-search').select2('val', category);
};

var overPassLayer;

// When the overpass query is done, show the data
function overpassCallback (data) {
	var elements = data.elements;
	$.each(elements, function (key, element) {
		var position = helpers.getCenterPosition(element, elements);
		if (position) {
			if (element.tags &&
					(element.tags.amenity || element.tags.shop ||
			    	element.tags.leisure || element.tags.tourism ||
			    	element.tags.natural) && element.tags.amenity !== 'parking_entrance') {
				var m = marker.fromPoi({
					position:     position,
					poi:          element,
					iconProvider: iconProvider
				});
				overPassLayer.addLayer(m);
			}
		}
	});
}

select2.poiSearch = function (selected) {
	url.setActivePoiLayer(selected);
	if (typeof overPassLayer !== 'undefined') {
		map.removeLayer(overPassLayer);
	}

	if (selected.length === 0) return;

	var query = [];
	if (overpass.combined[selected]) {
		query = overpass.combined[selected];
	} else {
		query = [ selected ];
	}

	var overpassLayerQuery = overpass.generateComplexQuery(query);
	if (overpassLayerQuery) {
		// Add Overpass layer
		overPassLayer = new L.OverPassLayer({
			minzoom: 14,
			endpoint: overpass.fastestEndpoint(),
			query: overpassLayerQuery,
			minZoomIndicatorOptions: {
				position: 'topleft',
				minZoomMessageNoLayer: 'Nincs réteg hozzáadva.',
				minZoomMessage: '<img src="/kepek/1391811435_Warning.png">A helyek a MINZOOMLEVEL. nagyítási szinttől jelennek meg. (Jelenleg: CURRENTZOOM)'
			},
			callback: overpassCallback
		}).addTo(map);
	}
};

select2.initialize = function () {
	$('#poi-search').select2({
		data: convertToSelect2Options(options),
		minimumResultsForSearch: minimumResultsForSearch,
		formatNoMatches: 'Nem található egyezés.',
		allowClear: true,
		dropdownCss: function () {
			if (isMobile) {
				var width = $('.select2-container').width() + 100;
				return {
					width: width + 'px'
				};
			}
		},
		matcher: function(term, text, opt) {
			return text.toUpperCase().indexOf(term.toUpperCase()) >= 0 ||
			       (opt.alt && opt.alt.toUpperCase().indexOf(term.toUpperCase()) >= 0);
		}
	})
	.on('change', function (event) {
		select2.poiSearch(event.val);
	})
	.on('select2-clearing', function (event) {
		if (typeof overPassLayer !== 'undefined') {
			map.removeLayer(overPassLayer);
		}

		url.removeActivePoiLayer();
	});
};

function convertToSelect2Options (options) {
	var select2Options = [];
	$.each(options, function (categoryId, category) {
		var children = [];

		$.each(category.children, function (id, text) {
			var object = {
				id:   id,
				text: text
			};

			if (Array.isArray(text)) {
				object.text = text[0];
				object.alt  = text[1];
			}

			children.push(object);
		});

		select2Options.push({
			id:   categoryId,
			text: category.title,
			children: children
		});
	});

	return select2Options;
}

/**
 * Fix select2 bug: https://github.com/select2/select2/issues/2061
 * Do not allow dropdown to be closed for 250ms after opening
 */
var lastOpenTime;

$(window).on('select2-open', function (event) {
	lastOpenTime = new Date().getTime();
});

$(window).on('select2-close', function (event) {
	var tempCounter = new Date().getTime();

	if (lastOpenTime > tempCounter - 250) {
        $(event.target).select2('open');
    }
});

/**
 * Own poi search options format to reduce number of lines / complexity
 * <search_id> is one of overpass.simple or overpass.combined keys
 * var options = {
 * 	 <search_id>: {
 *     title: 'Category title',
 *     children: {
 *       <search_id>: 'Poi type title',
 *       <search_id>: [ 'Poi type title', 'Alternative search text' ]
 *     }
 *   }
 * };
 *
 */
var options = {
	fooddrink: {
		title: 'Vendéglátás',
		children: {
			restaurant: 'Étterem',
			fast_food:  'Gyorsétterem',
			cafe:       'Kávézó',
			bar:        'Bár',
			pub:        [ 'Kocsma', 'Pub' ]
		}
	},
	shop: {
		title: 'Boltok',
		children: {
			convenience:   'Kisbolt',
			supermarket:   'Bevásárlóközpont',
			bakery:        'Pékség',
			clothes:       'Ruházati bolt',
			hairdresser:   'Fodrász',
			florist:       'Virágbolt',
			confectionery: 'Cukrászda',
			greengrocer:   'Zöldséges',
			bicycle:       [ 'Kerékpárbolt', 'Biciklibolt' ],
		}
	},
	money: {
		title: 'Pénz',
		children: {
			atm:              [ 'Bankautomata', 'ATM' ],
			bank:             'Bank',
			bureau_de_change: [ 'Pénzváltó', 'Valutaváltó' ]
		}
	},
	accommodation: {
		title: 'Szállás',
		children: {
			guest_house: 'Vendégház',
			hostel:      'Turistaszálló',
			hotel:       [ 'Szálloda', 'Hotel' ],
			information: 'Információ'
		}
	},
	healthcare: {
		title: 'Egészségügy',
		children: {
			clinic:     'Klinika',
			hospital:   'Kórház',
			dentist:    'Fogorvos',
			doctors:    'Orvosi rendelő',
			pharmacy:   'Gyógyszertár',
			veterinary: 'Állatorvos'
		}
	},
	leisure: {
		title: 'Szabadidő',
		children: {
			place_of_worship: 'Templom',
			cinema:           'Mozi',
			community_centre: 'Művelődési központ',
			library:          'Könyvtár',
			museum:           'Múzeum',
			theatre:          'Színház',
			park:             'Park',
			playground:       'Játszótér',
			sports_centre:    'Sportpálya',
			fitness_station:  [ 'Fitnesz park', 'Fitness' ]
		}
	},
	strand: {
		title: 'Strand',
		children: {
			beach_resort:  'Strand',
			water_park:    'Élményfürdő',
			natural_beach: 'Vízparti strand',
			swimming: 'Uszoda'
		}
	},
	education: {
		title: 'Oktatás',
		children: {
			kindergarten: 'Óvoda',
			school:       'Iskola',
			university:   [ 'Egyetem', 'Főiskola' ]
		}
	},
	travel: {
		title: 'Utazás',
		children: {
			fuel:    'Benzinkút',
			parking: 'Parkoló'
		}
	},
	other: {
		title: 'Egyéb',
		children: {
			drinking_water: 'Ivóvíz',
			toilets:        [ 'Nyilvános WC', 'Illemhely' ],
			recycling:      'Szelektív hulladékgyűjtő'
		}
	}
};
