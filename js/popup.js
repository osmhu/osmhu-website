var opening_hours = require('opening_hours');

var helpers = require('./helpers');

var popup = module.exports = {};

function osmBrowseUrl (element) {
	var baseUrl = 'http://www.openstreetmap.org/browse/';
	return baseUrl + element.type + '/' + element.id;
}

function osmEditUrl (element) {
	var baseUrl = 'http://www.openstreetmap.org/edit?';
	return baseUrl + element.type + '=' + element.id;
}

function wheelchairLogo (element) {
	var unknown = false;
	var link = 'http://wheelmap.org/hu/';
	if (element.type === 'node') {
		link+= 'nodes/' + element.id;
	} else if (element.type === 'way') {
		link+= 'nodes/-' + element.id;
	}
	var html = '<div class="wheelchair">';
	html+= '<a href="' + link + '" target="_blank">';
	var src = '/kepek/';
	var info = '';
	if (element.tags.wheelchair === 'yes') {
		src+= 'wheelchair-green.png';
		info = 'akadálymentes';
	} else if (element.tags.wheelchair === 'limited') {
		src+= 'wheelchair-yellow.png';
		info = 'részben akadálymentes';
	} else if (element.tags.wheelchair === 'no') {
		src+= 'wheelchair-red.png';
		info = 'nem akadálymentes';
	} else {
		unknown = true;
		html = '';
	}
	if (!unknown) {
		html+= '<img src="' + src + '" alt="' + info + '" title="' + info + '">';
		html+= '</a>';
		html+= '</div>';
	}
	return html;
}

// This will return a HTML code, that can be used in a popup
popup.generateHtml = function (element, options) {
	var shareUrl = (typeof options.shareUrl !== 'undefined') ? options.shareUrl : true;

	var html = '<div class="popup-content">';

	html+= wheelchairLogo(element);

	var title = popup.niceTitle(element.tags);
	var type = popup.niceType(element.tags);
	if (!title) {
		title = type;
		type  = null;
	}

	html+= '<h1 class="title">' + helpers.ucFirst(title) + '</h1>';
	if (type) {
		html+= '<p class="type">' + type + '</p>';
	}
	var address = popup.niceAddress(element.tags);
	if (address) {
		html+= '<p class="addr">' + address + '</p>';
	}
	html+= '<div class="details">';
	var phone = element.tags.phone || element.tags['contact:phone'];
	if (phone) {
		html+= '<p class="phone">Telefon: <i>' + phone + '</i></p>';
	}
	var website = element.tags.website || element.tags['contact:website'];
	if (website) {
		var niceUrl = website;
		// Decode URI
		niceUrl = decodeURI(niceUrl);
		// Remove url beginnings
		var hiddenUrlBegin = '';
		var hiddenUrlEnd = '';

		var beginningsToRemove = [
			'http://www.',
			'https://www.',
			'http://',
			'https://'
		];
		for (var i = 0; i < beginningsToRemove.length; i++) {
			var beginningToRemove = beginningsToRemove[i];
			if (niceUrl.substring(0, beginningToRemove.length) === beginningToRemove) {
				niceUrl = niceUrl.substring(beginningToRemove.length);
				hiddenUrlBegin = beginningToRemove;
				break;
			}
		}
		// Remove trailing slash
		if (niceUrl.substring(niceUrl.length - 1) === '/') {
			niceUrl = niceUrl.substring(0, niceUrl.length - 1);
		}
		var visibleUrl = niceUrl;
		// Shrink if too long
		if (visibleUrl.length > 34) {
			visibleUrl = niceUrl.substring(0, 32);
			hiddenUrlEnd = niceUrl.substring(32);
		}
		html+= '<p class="website">';
		html+= '<span class="website-label">Weboldal:&nbsp;</span>';
		html+= '<span class="website-url"><a href="' + website + '" target="_blank" title="' + (visibleUrl !== niceUrl ? niceUrl : '') + '">';
		if (hiddenUrlBegin.length > 0) {
			html+= '<span class="hidden-part">' + hiddenUrlBegin + '</span>';
		}
		html+= visibleUrl;
		if (hiddenUrlEnd.length > 0) {
			html+= '<span class="hidden-part">' + hiddenUrlEnd + '</span>';
			html+= '<span class="hidden-indicator"></span>';
		}
		html+= '</a></span>';
		html+= '</p>';
	}
	html+= '</div>';
	var openingHours = element.tags.opening_hours;
	if (openingHours) {
		var openingHoursTable = popup.generateOpeningHoursTable(openingHours);
		if (openingHoursTable) {
			html+= '<div class="opening_hours">';
			html+= '<p>Nyitvatartás:</p>';
			html+= openingHoursTable;
			html+= '</div>';
		}
	}
	html+= '<div class="options">';
	if (shareUrl) {
		html+= '<span class="mobile-hidden">';
		html+= '<button onclick="$(this).parents().find(\'.share\').show(); $(this).parents().find(\'.share input.share-url\').select();">Megosztás</button>';
		html+= '</span>';
	}
	var browseUrl = osmBrowseUrl(element);
	html+= '<button onclick="window.open(\'' + browseUrl + '\')">Minden adat</button>';
	var editUrl = osmEditUrl(element);
	html+= '<button onclick="window.open(\'' + editUrl + '\')">Szerkesztés</button>';
	if (shareUrl) {
		html+= '<div class="share">';
		html+= '<p>Megosztáshoz használd az alábbi hivatkozást:</p>';
		html+= '<p><input type="text" id="popup-poi-share-url" class="share-url" onclick="this.select()" readonly="readonly" ></p>';
		html+= '<p><button id="popup-poi-copy" type="button" data-clipboard-target="popup-poi-share-url">Másolás</button></p>';
		html+= '</div>';
	}
	html+= '</div>';
	html+= '</div>';
	return html;
};

popup.niceType = function (tags) {
	if (tags.amenity === 'restaurant') return 'Étterem';
	if (tags.amenity === 'fast_food') return 'Gyorsétterem';
	if (tags.amenity === 'cafe') return 'Kávézó';
	if (tags.shop === 'convenience') return 'Kisbolt';
	if (tags.shop === 'supermarket') return 'Bevásárlóközpont';
	if (tags.shop === 'bakery') return 'Pékség';
	if (tags.shop === 'clothes') return 'Ruházati bolt';
	if (tags.shop === 'hairdresser') return 'Fodrász';
	if (tags.shop === 'florist') return 'Virágbolt';
	if (tags.shop === 'confectionery') return 'Cukrászda';
	if (tags.shop === 'greengrocer') return 'Zöldség-gyümölcs kereskedés';
	if (tags.shop === 'bicycle') return 'Kerékpárbolt';
	if (tags.amenity === 'atm') return 'Bankautomata';
	if (tags.amenity === 'bank' && tags.atm === 'yes') return 'Bank + Bankautomata';
	if (tags.amenity === 'bank') return 'Bank';
	if (tags.amenity === 'bureau_de_change') return 'Pénzváltó';
	if (tags.amenity === 'bar') return 'Bár';
	if (tags.amenity === 'pub') return 'Kocsma';
	if (tags.tourism === 'guest_house') return 'Vendégház';
	if (tags.tourism === 'hostel') return 'Turistaszálló';
	if (tags.tourism === 'hotel') return 'Szálloda';
	if (tags.tourism === 'information') return 'Információs pont';
	if (tags.amenity === 'clinic') return 'Klinika';
	if (tags.amenity === 'hospital') return 'Kórház';
	if (tags.amenity === 'dentist') return 'Fogorvos';
	if (tags.amenity === 'doctors') return 'Orvosi rendelő';
	if (tags.amenity === 'pharmacy') return 'Gyógyszertár';
	if (tags.amenity === 'veterinary') return 'Állatorvos';
	if (tags.amenity === 'place_of_worship') return 'Templom';
	if (tags.amenity === 'cinema') return 'Mozi';
	if (tags.amenity === 'community_centre') return 'Művelődési központ';
	if (tags.amenity === 'library') return 'Könyvtár';
	if (tags.tourism === 'museum') return 'Múzeum';
	if (tags.amenity === 'theatre') return 'Színház';
	if (tags.leisure === 'park') return 'Park';
	if (tags.leisure === 'playground') return 'Játszótér';
	if (tags.leisure === 'sports_centre') return 'Sportpálya';
	if (tags.leisure === 'pitch') return 'Sportpálya';
	if (tags.leisure === 'track') return 'Sportpálya';
	if (tags.leisure === 'fitness_station') return 'Fitnesz park';
	if (tags.leisure === 'beach_resort') return 'Strand';
	if (tags.leisure === 'water_park') return 'Élményfürdő';
	if (tags.natural === 'beach') return 'Vízparti strand';
	if (tags.amenity === 'swimming_pool') return 'Uszoda';
	if (tags.amenity === 'kindergarten') return 'Óvoda';
	if (tags.amenity === 'school') return 'Iskola';
	if (tags.amenity === 'university') return 'Egyetem';
	if (tags.amenity === 'fuel') return 'Benzinkút';
	if (tags.amenity === 'parking') return 'Parkoló';
	if (tags.amenity === 'drinking_water') return 'Ivóvíz';
	if (tags.amenity === 'toilets') return 'Nyilvános WC';
	if (tags.amenity === 'recycling') return 'Szelektív hulladékgyűjtő';
};

popup.niceTitle = function (tags) {
	return tags.name || tags.operator;
};

popup.niceAddress = function (tags) {
	var city        = tags['addr:city'];
	var street      = tags['addr:street'];
	var housenumber = tags['addr:housenumber'];

	if (!city && !street) return false;

	var address = '';
	if (city) {
		address+= city;
	}
	if (city && street) {
		address+= ', ';
	}
	if (street) {
		address+= street;
	}
	if (street && housenumber) {
		address+= ' ' + housenumber;
	}
	var lastCharacterIsNumber = /\d$/;
	// If the last character of the housenumber is a number, add a dot
	if (lastCharacterIsNumber.test(housenumber)) {
		address+= '.';
	}
	return address;
};

function getFirstDateOfCurrentWeek () {
	var firstDate = new Date();
	var dayOfWeek = firstDate.getDay();
	var diff = firstDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
	firstDate = new Date(firstDate.setDate(diff));
	firstDate.setHours(0);
	firstDate.setMinutes(0);
	firstDate.setSeconds(0);

	return firstDate;
}

function dayIsToday (day) {
	var now = new Date();
	var dayOfWeek = now.getDay() - 1;
	if (dayOfWeek === -1) dayOfWeek = 6;
	return dayOfWeek === day;
}

// Add leading zero if a date part is less than 10
function addZero (datePart) {
	if (datePart < 10) {
		datePart = '0' + datePart;
	}
	return datePart;
}

popup.generateOpeningHoursTable = function (openingHoursString) {
	var table = '';

	if (openingHoursString === '24/7') {
		table+= '<table>';
		table+= '<tr class="today">';
		table+= '<td class="day">Non-stop</td>';
		table+= '<td>(Hétfő-vasárnap 0-24)</td>';
		table+= '</tr>';
		table+= '</table>';
		return table;
	}

	try {
		var days = 'Hétfő Kedd Szerda Csütörtök Péntek Szombat Vasárnap'.split(' ');
		var openingHours = new opening_hours(openingHoursString);
		table+= '<table>';
		var from = getFirstDateOfCurrentWeek();
		for (var day = 0; day < 7; day++) {
			if (dayIsToday(day)) {
				table+= '<tr class="today">';
			} else {
				table+= '<tr>';
			}
			table+= '<td class="day">' + days[day] + '</td>';
			var to = new Date(from);
			to.setDate(to.getDate() + 1);
			var intervals = openingHours.getOpenIntervals(from, to);
			var open = [];
			for (var i in intervals) {
				var openFrom   = new Date(intervals[i][0]);
				var openTo     = new Date(intervals[i][1]);
				var fromHour   = addZero(openFrom.getHours());
				var fromMinute = addZero(openFrom.getMinutes());
				var toHour     = addZero(openTo.getHours());
				var toMinute   = addZero(openTo.getMinutes());
				if (toHour === '00' && toMinute === '00') {
					toHour = '24';
				}
				open.push(fromHour + ':' + fromMinute + ' - ' + 
						  toHour   + ':' + toMinute);
			}
			if (open.length > 0) {
				table+= '<td>' + open.join(', ') + '</td>';
			} else {
				table+= '<td>zárva</td>';
			}
			from = to;
			table+= '</tr>';
		}
		table+= '</table>';
		return table;
	} catch (err) {
		console.error('Unable to parse opening_hours: ' + err);
		return false;
	}
};
