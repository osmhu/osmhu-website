var $ = require('jquery');
require('jquery.cookie');

var introduction = module.exports = {};

// Options for introduction panel
var panel = $('#introduction');
var mapContainer = $('#map-container');
var toggler = $('#introduction-toggler');
var width = 262;
var searchResults = $('#search-results');
var cookieName = 'introduction-hidden';
var animationOptions = {
	duration: 200,
	queue:    false
};

// On load hide introduction if cookie is set
var hideOnLoad = $.cookie(cookieName);
if (hideOnLoad) {
	panel.hide();
	panel.css('left', '-' + width);
	mapContainer.css('left', 0);
	toggler.css('left', 0);
	changeTogglerIcon('show');
} else {
	toggler.css('left', width);
	changeTogglerIcon('hide');
}

function changeTogglerIcon (newIcon) {
	if (newIcon === 'show') {
		toggler.find('.toggler').html('❱');
	} else {
		toggler.find('.toggler').html('❰');
	}
}

introduction.toggle = function () {
	if (panel.is(':visible')) {
		hide();
	} else {
		show();
	}
};

function hide () {
	$.cookie(cookieName, 'true');

	panel.animate({
		left: '-' + width
	}, {
		duration: 200,
		queue:    false,
		complete: function () {
			panel.hide();
		}
	});

	changeTogglerIcon('show');

	toggler.animate({
		left: 0
	}, animationOptions);

	var animateMap = !searchResults.is(':visible');
	if (animateMap) {
		mapContainer.animate({
			left: 0
		}, {
			duration: 200,
			queue: false,
			complete: function () {
				map.invalidateSize();
			}
		});
	}
}

function show () {
	$.removeCookie(cookieName);

	panel.show();

	panel.animate({
		left: 0
	}, {
		duration: 200,
		queue:    false,
		complete: function () {
			toggler.css('left', width);
		}
	});

	changeTogglerIcon('hide');

	mapContainer.animate({
		left: width
	}, animationOptions);
}

introduction.overDrawn = function () {
	mapContainer.animate({
		left: width
	}, {
		duration: 200,
		queue: false,
		complete: function () {
			map.invalidateSize();
		}
	});

	toggler.hide();
};

introduction.overDrawnEnd = function () {
	if (!panel.is(':visible')) {
		mapContainer.animate({
			left: 0
		}, {
			duration: 200,
			queue: false,
			complete: function () {
				map.invalidateSize();
				toggler.show();
			}
		});
	} else {
		toggler.show();
	}
};
