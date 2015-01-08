// TODO REMOVE old poi list

// /* http://wiki.openstreetmap.org/wiki/Nominatim/Special_Phrases/HU 
//  *
//  * */

// var menu = [
// 	[ 'p' , 'Pénz' ],
// 	[ 'v' , 'Vendéglátás' ],
// 	[ 'sz', 'Szállás' ],
// 	[ 'e' , 'Egészségügy' ],
// 	[ 'k' , 'Kikapcsolódás' ],
// 	[ 'o' , 'Oktatás' ],
// 	[ 'be' , 'Boltok (élelmiszer)' ],
// 	[ 'b' , 'Boltok' ],
// 	[ 'u' , 'Utazás' ],
// 	[ 'x' , 'Egyéb']
// ]
// //var poik = {}; // [ 'amenity', 'tourism', 'shop', 'cafe', 'leisure', 'gambling', 'office' ];
// var poik = {
// 	'amenity': {
// 		'atm': [ 'Bankautomata', 'p'],
// 		'bank': ['Bank', 'p'],
// 		'bar': [ 'Bár', 'v'],
// 		'bureau_de_change': ['Pénzváltó', 'p'],
// 		'cafe': [ 'Kávézó', 'v'],
// 		'cinema': ['Mozi', 'k'],
// 		'clinic': ['Klinika', 'e'],
// 		'club': ['Klub', 'k'],
// 		'community_centre': ['Művelődési központ', 'k'],
// 		'dentist': ['Fogorvos', 'e'],
// 		'doctors': ['Orvosi rendelő', 'e'],
// 		'drinking_water': ['Ivóvíz', 'k'],
// 		'fast_food': ['Gyorsétterem', 'v'],
// 		'fuel': ['Benzinkút', 'u'],
// 		//'gym': ['Fitness terem', 'k'],
// 		//'health_centre': ['Egészségügyi központ', 'e'],
// 		'hospital': ['Kórház', 'e'],
// 	//	'hotel': ['Szálloda', 'sz'],
// 		'kindergarten': ['Óvoda', 'o'],
// 		'library': ['Könyvtár', 'k'],
// 		'market': ['Piac', 'be'],
// 		//'marketplace': ['Vásártér', 'be'],
// 		'park': ['Park', 'k'],
// 		'parking': ['Parkoló', 'u'],
// 		'pharmacy': ['Gyógyszertár', 'e'],
// 		'post_office': ['Posta', 'b'],
// 		'pub': ['Kocsma', 'v'],
// 		'recycling': ['Szelektív hulladékgyűjtő', 'x'],
// 		'restaurant': ['Étterem', 'v'],
// 		'sauna': ['Szauna', 'k'],
// 		'school': ['Iskola', 'o'],
// 		'theatre': ['Színház', 'k'],
// 		'toilets': ['WC', 'x'],
// 		'university': ['Egyetem', 'o'],
// 		'veterinary': ['Állatorvos', 'e']
// 	},
// 	'leisure' : {
// 		'park': ['Park', 'k' ],
// 		'pitch': ['Focipálya', 'k'],
// 		'playground': ['Játszótér', 'k'],
// 		'swimming_pool': ['Uszoda', 'k']
// 		//'track': ['Futópálya', 'k'],
// 	},
// 	'shop' : {
// 		//'alcohol': ['Alkoholos italbolt', 'be'],
// 		'bakery': ['Pékség', 'be'],
// 		//'beauty': ['Szépségszalon', 'x'], "Szépészeti bolt"!?
// 		'bicycle': ['Kerékpárbolt', 'b'],
// 		'books': ['Könyvesbolt', 'b'],
// 		'butcher': ['Hentesbolt', 'be'],
// 		//'chemist': ['Vegyipari bolt', 'b'],  "Drogéria" lenne
// 		'clothes': ['Ruházati bolt', 'b'],
// 		'computer': ['Számítástechnikai bolt', 'b'],
// 		'confectionery': ['Cukrászda', 'be'],
// 		'convenience': ['Kisbolt', 'be'],
// 		'copyshop': ['Fénymásoló bolt', 'b'],
// 		'cosmetics': ['Kozmetikai bolt', 'b'],
// 		'doityourself': ['Barkácsbolt', 'b'],
// 		//'electronics': ['Elektronikai bolt', 'b'],
// 		'florist': ['Virágárus', 'b'],
// 		'furniture': ['Bútorbolt', 'b'],
// 		'gift': ['Ajándékbolt', 'b'],
// 		'greengrocer': ['Zöldséges', 'be'],
// 		'grocery': ['Fűszerbolt', 'be'],
// 		'hairdresser': ['Fodrászat', 'x'],
// 		'hardware': ['Szerelési bolt', 'b'],
// 		'jewelry': ['Ékszerbolt', 'b'],
// 		'mobile_phone': ['Mobiltelefonbolt', 'b'],
// 		'newsagent': ['Újságárus', 'b'],
// 		'optician': ['Látszerész', 'b'],
// 		'organic': ['Bioélelmiszerbolt', 'be'],
// 		'outdoor': ['Túrabolt', 'b'],
// 		'shopping_centre': ['Bevásárlóközpont', 'be'],
// 		'shopping_centre': ['Bevásárlóközpont', 'b'],
// 		'sports': ['Sportbolt', 'b'],
// 		'stationery': ['Írószerbolt', 'b'],
// 		'toys': ['Játékbolt', 'b'],
// 		'wine': ['Borárusító italbolt', 'be']
// 	},
// 	'tourism' : {
// 		'guest_house': ['Vendégház', 'sz'],
// 		'hostel': ['Turistaszálló', 'sz'],
// 		'hotel': ['Szálloda', 'sz'],
// 		'information': ['Információ', 'sz'],
// //		'motel': ['Motel', 'sz'],
// 		'museum': ['Múzeum', 'k']
// 	}
// };
// // Simple translation array for nominatim class/type pairs
// var nominatim_names = {
// 	'place': {
// 		'city': 'város',
// 		'town': 'város',
// 		'village': 'község',
// 		'hamlet': 'község'
// 	},
// 	'boundary': {
// 		'administrative': 'határvonal'
// 	},
// 	'highway': {
// 		'residential': 'közterület',
// 		'living_street': 'közterület'
// 	}
// };

// // Generates the POI list.
// // showall: disables click-opening of sublists
// // returns: true if any checkbox got preselected from query string "q" value.
// function poilista(showall) {
// 	var s = {};
// 	var showall = Boolean(showall);

// 	// Reselect from query string "q" if present
// 	var query = qs();
// 	var selected = [];
// 	if(query["q"]) {
// 		var q = decodeURIComponent(query["q"]);
// 		var querypoi = q.replace(/\+.*/, "");
// 		selected = querypoi.split(',');
// 		if(selected.length > 1) {
// 			MULTIPOIQUERY = q.replace(/^[^\+]*/, "").replace(/\+/g, " ");
// 			MULTIPOIS = selected;
// 			$("#ker").val("Kijelölt helyek" + MULTIPOIQUERY);
// 		}
// 	}

// 	/* Kigyűjtés csoportokba */
// 	var count = 0;
// 	for(var poi in poik) {
// 		var csoport = poik[poi];
// 		for(var helytipus in csoport) {
// 			var hely = csoport[helytipus];
// 			if(!s[hely[1]]) {
// 				s[hely[1]] = "";
// 			}
// 			if($.inArray(hely[0], selected) != -1) {
// 				var checked = " checked=\"checked\"";
// 			} else {
// 				var checked = "";
// 			}
// 			s[hely[1]] += "<li><input type=\"checkbox\" id=\"chk_poi" + count + "\" value=\"" + hely[0] 
// 				+ "\" onclick=\"poichkclick(" + String(showall) + ");\"" + checked 
// 				+ " /><a href=\"javascript:void();\" onclick=\"poiclick('" + hely[0] + "', " + count + "); return false;\">" 
// 				+ hely[0] + "</a></li>\n";
// 			count++;
// 		}
// 	}
// 	/* UL-ek rajzolasa csoportonkent */
// 	var allLink = " | <a href=\"javascript:void();\" onclick=\"poiall(this," + String(showall) + "); return false;\">mind</a>";
// 	var html = "<ul id=\"helyek\">";
// 	for(var i = 0; i < menu.length; i++) {
// 		if(!showall) {
// 			html += "<li><a href=\"javascript:void();<\" class=\"head\">" + menu[i][1] + "</a>" + allLink + "<ul>" + s[menu[i][0]] + "</ul></li>\n";
// 		} else {
// 			html += "<li>" + menu[i][1] + allLink + "<ul>" + s[menu[i][0]] + "</ul></li>\n";
// 		}
// 	}
// 	html += "</ul>";
// 	$("#poik").html(html);

// 	if(!showall) {
// 		// HELYEK kattintasa (kinyito-bezaro)
// 		$('#helyek .head').click(function() {
// 			$(this).parent().toggleClass("nyit").find("> ul").toggle();
// 			return false;
// 		});
// 		$('#helyek .head').parent().find("ul").toggle(false); // Eltunnek
// 	}
// 	return (selected.length > 0);
// }
// // POI name click, unselect all other checkboxes
// function poiclick(hely, id) {
// 	$('#helyek input').removeAttr("checked");
// 	$('#chk_poi' + id).attr("checked", "checked");
// 	$('#poisearchbutton').removeAttr("disabled");
// 	var ker = document.getElementById("ker").value;
// 	ker = ker.replace(/^.* itt */, "");
// 	ker = ker.replace(/^(.*),.*$/, "$1");
// 	ker = hely + " itt " + ker;
// 	document.getElementById("ker").value = ker;
// }
// // Checkbox click: multiple places are selectable 
// function poichkclick(showall) {
// 	updatePoiSelection(showall);
// }

// // Copy selected checkboxes to input box and/or global variable
// function updatePoiSelection(showall) {
// 	var poilist = "";
// 	var checkedCount = $('#helyek input:checked').length;

// 	// Build list of checked POIs
// 	$('#helyek input:checked').each(function(idx,chk) {
// 		if(poilist) { poilist += ","; }
// 		poilist += chk.value;
// 	});
// 	var ker = document.getElementById("ker").value;
// 	ker = ker.replace(/^.* itt */, "");
// 	ker = ker.replace(/^(.*),.*$/, "$1");
// 	if(poilist) {
// 		if(showall || checkedCount == 1) {
// 			ker = poilist + " itt " + ker;
// 		} else {
// 			ker = "Kijelölt helyek itt " + ker;
// 		}
// 		$('#poisearchbutton').removeAttr("disabled");
// 	} else {
// 		ker = "";
// 		$('#poisearchbutton').attr("disabled", "disabled");
// 	}
// 	document.getElementById("ker").value = ker;
// }

// /* Set all items of this POI category */
// function poiall(link, showall) {
// 	$(link).parent("li").find("input[type=\"checkbox\"]").attr("checked", "checked");
// 	$(link).parent("li").find("ul").toggle(true);
// 	updatePoiSelection(showall);
// }

// // Parse query string parameters into an array
// // http://javascript.about.com/library/blqs1.htm
// function qs() {
// 	var qsParm = new Array();
// 	var query = window.location.search.substring(1);
// 	var parms = query.split('&');
// 	for (var i=0; i<parms.length; i++) {
// 		var pos = parms[i].indexOf('=');
// 		if (pos > 0) {
// 			var key = parms[i].substring(0,pos);
// 			var val = parms[i].substring(pos+1);
// 			qsParm[key] = val;
// 		}
// 	}
// 	return qsParm;
// }
