var overpass_url = "http://overpass.osm.rambler.ru/cgi/interpreter";
var keepright_url = "http://keepright.ipax.at/report_map.php?zoom=13&lat={lat}&lon={lon}&layers=B0T&ch=0%2C30%2C40%2C50%2C70%2C90%2C120%2C130%2C150%2C160%2C170%2C180%2C191%2C194%2C195%2C196%2C201%2C202%2C203%2C204%2C205%2C206%2C207%2C208%2C210%2C220%2C231%2C232%2C270%2C281%2C282%2C283%2C284%2C285%2C291%2C292%2C293%2C294%2C311%2C312%2C313%2C320%2C350%2C370%2C380%2C401%2C402%2C411%2C412%2C413&show_ign=1&show_tmpign=1"
//var bingcompare_url = "http://tools.geofabrik.de/mc/?mt0=mapnik&mt1=bingsat&lon={lon}&lat={lat}&zoom=16"
var bingcompare_url = "http://mc.bbbike.org/mc/?lon={lon}&lat={lat}&zoom=16&num=2&mt0=mapnik&mt1=bing-satellite"

function openKeepRight(placeid) {
	getSingleNode(placeid, openKeepRightGo);
}
function openKeepRightGo(element) {
	var url = keepright_url.replace("{lat}", element.lat).replace("{lon}", element.lon);
	var win = window.open(url, "_blank");
	win.focus();
}

function openBingCompare(placeid, linktag) {
	getSingleNode(placeid, openBingCompareGo);
}
function openBingCompareGo(element) {
	var url = bingcompare_url.replace("{lat}", element.lat).replace("{lon}", element.lon);
	var win = window.open(url, "_blank");
	win.focus();
}
function highlight(node, type) {
	if(type == "p") {
		$(node).parent().addClass("highlight");
	} else if(type == "pp") {
		$(node).parent().parent().addClass("highlight");
	} else {
		$(node).addClass("highlight");
	}
}

function getSingleNode(id, callback) {
	
	var data = {'data': "[out:json];node(" + id + ");out body;" };

	$.get(overpass_url, data, function(d) {
		if(d.elements) {
			callback(d.elements[0]);
		} else {
			alert("Overpass returned no elements for this id:" + placeid);
		}
	});
}
