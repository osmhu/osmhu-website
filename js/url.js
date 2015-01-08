var share = require('./share');
var $ = require('jquery');

var url = module.exports = {};

var activeBaseLayer; // Currently active base layer
var activeOverlays = []; // Currently selected overlays
var activePoi; // Currently active POI popup
var activePoiLayer; // Currently active POI layer

url.setBaseLayer = function (layerId) {
    activeBaseLayer = layerId;
};

url.addOverlay = function (overlayId) {
    activeOverlays.push(overlayId);
    url.update();
};

url.removeOverlay = function (overlayId) {
    for (var i = activeOverlays.length; i >= 0; i--) {
        if (activeOverlays[i] === overlayId) {
            activeOverlays.splice(i, 1);
        }
    }
    url.update();
};

url.setActivePoi = function (elementType, elementId) {
    activePoi = {
        type: elementType,
        id:   elementId
    };
};

url.removeActivePoi = function () {
    activePoi = null;
};

url.setActivePoiLayer = function (layerId) {
    activePoiLayer = layerId;
    url.update();
};

url.removeActivePoiLayer = function () {
    activePoiLayer = null;
    url.update();
};

/**
 * Create OpenStreetMap.org URL without domain part
 */
function orgParameters () {
    var params = [];

    var zoom = map.getZoom();

    var center = map.getCenter();
    var lat = center.lat;
    var lon = center.lng;

    // Round lat and lon
    var rounding = 100000; // round to 6 digits
    lat = Math.round(lat * rounding) / rounding;
    lon = Math.round(lon * rounding) / rounding;

    return '#map=' + zoom + '/' + lat + '/' + lon;
}

/**
 * Update OpenStreetMap.org urls on page
 */
url.updateOrgUrls = function () {
    var orgUrl = orgParameters();
    $('a#orglink').attr('href', 'http://openstreetmap.org/' + orgUrl);
    $('a#orgEditLink').attr('href', 'http://openstreetmap.org/edit' + orgUrl);
};

/**
 * Display url param as HTML
 */
url.escapeTags = function (string) {
    return string.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/'/g, '&#x27;')
                 .replace(/"/g, '&quot;')
                 .replace(/\r?\n/g, '<br>'); // Replace newline with <br>
};

/**
 * Update the location url in the urlbar
 */
url.update = function () {
    var withoutDomain = url.withoutDomain();
    history.replaceState(null, window.document.title, withoutDomain);
    $('input.share-url').val('http://www.openstreetmap.hu' + withoutDomain);
    url.updateOrgUrls();
};

/**
 * Create permanent URL without domain part
 */
url.withoutDomain = function () {
    var params = [];

    var zoom = map.getZoom();

    var lat, lon;

    if (share.isOpen()) {
        var markerPosition = share.getMarkerPosition();
        lat = markerPosition.lat;
        lon = markerPosition.lng;
    } else {
        var center = map.getCenter();
        lat = center.lat;
        lon = center.lng;
    }

    // Round lat and lon
    var rounding = 100000; // round to 6 digits
    lat = Math.round(lat * rounding) / rounding;
    lon = Math.round(lon * rounding) / rounding;

    params.push('zoom=' + zoom);

    if (!activePoi) {
        if (share.isOpen()) {
            params.push('mlat=' + lat);
            params.push('mlon=' + lon);
        } else {
            params.push('lat='  + lat);
            params.push('lon='  + lon);
        }
    }

    var markerTextSet = share.isOpen() && share.getText().length > 0;

    if (markerTextSet) {
        var markerText = encodeURIComponent(share.getText());
        params.push('mtext='  + markerText);
    }

    if (typeof activeBaseLayer !== 'undefined') {
        params.push('layer=' + activeBaseLayer);
    }

    $.each(activeOverlays, function (key, layer) {
        params.push(layer + '=1');
    });

    var includePoiLayer = activePoiLayer && activePoiLayer.length > 0 && !activePoi;
    if (includePoiLayer) {
        params.push('poi=' + activePoiLayer);
    }

    if (activePoi) {
        params.push('type=' + activePoi.type);
        params.push('id='   + activePoi.id);
    }

    return '/?' + params.join('&');
};
