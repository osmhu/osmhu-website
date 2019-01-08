const isoDayOfWeek = require('date-fns/get_iso_day');

const OpeningHoursTable = require('./popup/OpeningHoursTable');

var popup = module.exports = {};

function osmBrowseUrl(element) {
	const baseUrl = 'https://www.openstreetmap.org/browse/';
	return baseUrl + element.type + '/' + element.id;
}

function osmEditUrl(element) {
	const baseUrl = 'https://www.openstreetmap.org/edit?';
	return baseUrl + element.type + '=' + element.id;
}

function createWheelmapUrl(element) {
	const baseUrl = 'https://wheelmap.org/hu';
	let url;
	if (element.type === 'node') {
		url = baseUrl + '/nodes/' + element.id;
	} else if (element.type === 'way') {
		url = baseUrl + '/nodes/-' + element.id;
	} else {
		return false;
	}
	return url;
}

function wheelchairLogo(element) {
	var unknown = false;
	var html = '<div class="wheelchair">';
	const wheelMapUrl = createWheelmapUrl(element);
	if (wheelMapUrl) {
		html+= '<a href="' + wheelMapUrl + '" target="_blank">';
	}
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

popup.upperCaseFirstLetter = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

popup.removeUrlTrailingSlash = (url) => {
	// Remove trailing slash
	if (url.substring(url.length - 1) === '/') {
		return url.substring(0, url.length - 1);
	}
	return url;
};

popup.createShrinkedWebsiteUrlHtml = (websiteUrl, maxLength) => {
	// Decode URI
	let niceUrl = decodeURI(websiteUrl);
	// Remove url beginnings
	let hiddenUrlBegin = '';
	let hiddenUrlEnd = '';

	const beginningsToRemove = [
		'http://www.',
		'https://www.',
		'http://',
		'https://',
	];
	for (let i = 0; i < beginningsToRemove.length; i++) {
		const beginningToRemove = beginningsToRemove[i];
		if (niceUrl.substring(0, beginningToRemove.length) === beginningToRemove) {
			niceUrl = niceUrl.substring(beginningToRemove.length);
			hiddenUrlBegin = beginningToRemove;
			break;
		}
	}
	let visibleUrl = popup.removeUrlTrailingSlash(niceUrl);
	// Shrink if too long
	if (visibleUrl.length > maxLength + 2) {
		visibleUrl = niceUrl.substring(0, maxLength);
		hiddenUrlEnd = niceUrl.substring(maxLength);
	}
	let html;
	html += '<span class="website-label">Weboldal:&nbsp;</span>';
	html += '<span class="website-url"><a href="' + websiteUrl + '" target="_blank" title="' + (visibleUrl !== niceUrl ? niceUrl : '') + '">';
	if (hiddenUrlBegin.length > 0) {
		html += '<span class="hidden-part">' + hiddenUrlBegin + '</span>';
	}
	html += visibleUrl;
	if (hiddenUrlEnd.length > 0) {
		html += '<span class="hidden-part">' + hiddenUrlEnd + '</span>';
		html += '<span class="hidden-indicator"></span>';
	}
	html += '</a></span>';

	return html;
};

// This will return a HTML code, that can be used in a popup
popup.generateHtml = function (element, options) {
	var shareUrl = (typeof options.shareUrl !== 'undefined') ? options.shareUrl : true;

	var html = '<div class="popup-content">';

	html+= wheelchairLogo(element);

	var title = popup.niceTitle(element.tags);
	var type = popup.niceType(element.tags);
	if (!title && type) {
		title = type;
		type  = null;
	}
	if (!title && !type) {
		title = 'Hely';
	}

	html+= '<h1 class="title">' + popup.upperCaseFirstLetter(title) + '</h1>';
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
		html += '<p class="website">';
		html += popup.createShrinkedWebsiteUrlHtml(website, 34);
		html += '</p>';
	}
	html+= '</div>';
	var openingHours = element.tags.opening_hours;
	if (openingHours) {
		const isoDayOfWeekForToday = isoDayOfWeek(new Date());
		var openingHoursTable = OpeningHoursTable.generateTable(openingHours, isoDayOfWeekForToday);
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

popup.niceTitle = function(tags) {
	return tags.name || tags.ref || tags.operator;
};

popup.niceAddress = function(tags) {
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

popup.niceType = function(tags) {
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
	if (tags.amenity === 'bicycle_rental') return 'Bicikli kölcsönző';
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

	// Train, subway, bus stations
	if (tags.railway === 'station' && tags.subway === 'yes') return 'Metrómegálló';
	if (tags.building === 'train_station' && tags.public_transport === 'station') return 'Vasútállomás';
	if (tags.railway === 'station') return 'Vasútállomás';
	if (tags.amenity === 'bus_station') return 'Buszpályaudvar';
	if (tags.highway === 'bus_stop' || tags.public_transport === 'stop_position') return 'Buszmegálló';

	// Building types
	// Source: http://wiki.openstreetmap.org/wiki/Hu:Key:building?uselang=hu
	// Ordered by frequency: http://taginfo.openstreetmap.hu/keys/building
	if (tags.building === 'apartments') return 'Társasház';
	if (tags.building === 'farm') return 'Farm';
	if (tags.building === 'house') return 'Családi ház';
	if (tags.building === 'industrial') return 'Ipari épület';
	if (tags.building === 'church') return 'Templom';
	if (tags.building === 'chapel') return 'Kápolna';
	if (tags.building === 'residential') return 'Lakóház';
	if (tags.building === 'garages') return 'Gárázsok';
	if (tags.building === 'school') return 'Iskolépület';
	if (tags.building === 'commercial') return 'Irodaház';
	if (tags.building === 'retail') return 'Áruház';
	if (tags.building === 'greenhouse') return 'Üvegház';
	if (tags.building === 'yes') return 'Épület';
	// Budapest
	if (tags.name === 'Budapest' && tags.boundary === 'administrative' && tags.admin_level === '8') return 'Főváros';
	// Places
	// Ordered by frequency: http://taginfo.openstreetmap.hu/keys/place#values
	if (tags.place === 'locality') return 'Hely';
	if (tags.place === 'village') return 'Falu';
	if (tags.place === 'suburb') return 'Városrész';
	if (tags.place === 'farm') return 'Farm';
	if (tags.place === 'hamlet') return 'Falu';
	if (tags.place === 'neighbourhood') return 'Szomszédság';
	if (tags.place === 'town') return 'Város';
	if (tags.place === 'islet') return 'Sziget';
	if (tags.place === 'island') return 'Sziget';
	if (tags.place === 'county') return 'Megye';
	if (tags.place === 'city') return 'Város';
	if (tags.place === 'district') return 'Kerület';
	// Hungarian administrative rules
	// Source: http://wiki.openstreetmap.org/wiki/Hu:Tag:boundary=administrative?uselang=hu
	if (tags.boundary === 'administrative' && tags.admin_level === '6') return 'Megye';
	if (tags.boundary === 'administrative' && tags.admin_level === '7') return 'Járás';
	if (tags.boundary === 'administrative' && tags.admin_level === '8') return 'Város';
	if (tags.boundary === 'administrative' && tags.admin_level === '9') return 'Kerület';

	// Highways
	if (tags.highway === 'residential') return 'Út';
	if (tags.highway === 'pedestrian') return 'Gyalogos útvonal';
};
