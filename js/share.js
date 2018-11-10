var L = require('leaflet');

const CopyButton = require('./CopyButton');

var share = module.exports = {};

var marker = null;

share.getText = function () {
	if (marker && marker.text) {
		return marker.text.trim();
	}
	return '';
};

share.setText = function (text) {
	marker.text = text;
	$(window).trigger('updateUrl');
};

share.getMarkerPosition = function () {
	return marker.getLatLng();
};

share.isOpen = function () {
	return marker !== null;
};

share.toggle = function () {
	if (share.isOpen()) {
		closePopup();
	} else {
		openPopup();
	}
	$(window).trigger('updateUrl');
};

function openPopup () {
	var center = map.getCenter();

	marker = new L.marker([ center.lat, center.lng ], {
		draggable: true,
		zIndexOffset: 1000
	});

	marker.on('dragend', function () {
		var markerPosition = marker.getLatLng();
		map.setView([ markerPosition.lat, markerPosition.lng ]);
		marker.bindPopup(popupContent(), {
			closeButton: false,
			closeOnClick: false
		}).openPopup();

		$('#popup-share-text').val(share.getText());
		$(window).trigger('updateUrl');

		bindPopupActions();
	});

	marker.on('popupopen', function () {
		$('#popup-share-text').focus();

		var needToUpdate = $('#popup-share-text').val() !== share.getText();
		if (needToUpdate) {
			$('#popup-share-text').val(share.getText());
			$(window).trigger('updateUrl');
		}

		bindPopupActions();
	});

	marker.addTo(map);

	marker.bindPopup(popupContent(), {
		closeButton: false,
		closeOnClick: false
	}).openPopup();

	bindPopupActions();
}

function bindPopupActions () {
	$('#popup-share-close').on('click', function () {
		closePopup();
		return false;
	});

	$('#popup-share-url').on('click', function () {
		$(this).select();
	});

	$('#popup-share-text').on('keyup', function () {
		var text = $(this).val();
		share.setText(text);
	});

  CopyButton.copyTargetOnButtonClick('#popup-share-copy', '#popup-share-url');
}

function closePopup () {
	if (map.hasLayer(marker)) {
		map.removeLayer(marker);
	}
	marker = null;
	$(window).trigger('updateUrl');
}

function popupContent () {
	var html = '<div class="popup-share">';
		html+= '<a id="popup-share-close" class="leaflet-popup-close-button" href="#close">×</a>';
		html+= '<h1>Hely küldése:</h1>';
		html+= '<textarea id="popup-share-text" rows="2" placeholder="Megjelenő szöveg"></textarea>';
		html+= '<p>Hivatkozás: <input type="text" id="popup-share-url" class="share-url" readonly="readonly" ></p>';
		html+= '<button id="popup-share-copy" type="button" data-clipboard-target="popup-share-url">Hivatkozás másolása</button>';
		html+= '</div>';
	return html;
}
