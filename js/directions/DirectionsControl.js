/* globals window */

const $ = require('jquery');
const log = require('loglevel');

const $startField = $('#directions #directions-start-search');
const $endField = $('#directions #directions-end-search');

let avoidTollRoads = false;
let transportType = 'fastest';

module.exports = class DirectionsControl {
	constructor(directionsResultLayer) {
		this.directionsResultLayer = directionsResultLayer;
	}

	initializeControls() {
		$('#search-area #mode-selector #search-mode a').click((event) => {
			event.preventDefault();

			DirectionsControl.activateSearchControl();
		});

		$('#search-area #mode-selector #directions-mode a').click((event) => {
			event.preventDefault();

			DirectionsControl.activateDirectionsControl();
		});

		$('#directions form').on('submit', (event) => {
			event.preventDefault();

			this.startDirections();
		});

		$('#direction-results-avoid-toll-roads').on('change', () => {
			const checked = $('#direction-results-avoid-toll-roads').prop('checked');
			avoidTollRoads = checked;

			this.startDirections();
		});

		$('#direction-results-choose-type').on('change', () => {
			const newTransportType = $('#direction-results-choose-type').val();
			transportType = newTransportType;

			this.startDirections();
		});

		$('#direction-results a.close').on('click', () => {
			$('#direction-results').hide();

			$(window).trigger('search-results-hide');
		});
	}

	static activateSearchControl() {
		$('#search-area #mode-selector #search-mode').addClass('active');
		$('#search-area #mode-selector #directions-mode').removeClass('active');
		$('#search').show();
		$('#directions').hide();
		$('body').removeClass('directions-active');
		$('#search-area input#text-search').focus();
		$(window).trigger('mode-change');
	}

	static activateDirectionsControl() {
		$('#search-area #mode-selector #directions-mode').addClass('active');
		$('#search-area #mode-selector #search-mode').removeClass('active');
		$('#directions').show();
		$('#search').hide();
		$('body').addClass('directions-active');
		$startField.focus();
		$(window).trigger('mode-change');
	}

	startDirections() {
		const start = $startField.val();
		const end = $endField.val();

		if (start.length < 3) {
			$startField.css('border-color', 'red');
		} else {
			$startField.css('border-color', '#aaa');
		}

		if (end.length < 3) {
			$endField.css('border-color', 'red');
		} else {
			$endField.css('border-color', '#aaa');
		}

		if (start.length >= 3 && end.length >= 3) {
			const routeStart = DirectionsControl.convertToMapQuestFormat(start);
			const routeEnd = DirectionsControl.convertToMapQuestFormat(end);

			this.directionsResultLayer.route(
				routeStart,
				routeEnd,
				transportType,
				avoidTollRoads,
				(error) => {
					$endField.removeClass('searching');

					if (error instanceof Error || error.length > 0) {
						log.error(error);
						$('#general-error').fadeIn(200);
						let html = '<strong>Az útvonaltervezés jelenleg nem elérhető!</strong><br />';
						html += 'Tipp: használd az <a href="https://www.openstreetmap.org/directions" target="_blank">OpenStreetMap.org útvonaltervezőt!</a>';
						$('#general-error').html(html);
						setTimeout(() => {
							$('#general-error').fadeOut(200);
						}, 15000);
					} else {
						$(window).trigger('search-results-show');
					}
				},
			);

			$endField.addClass('searching');
		}
	}

	static convertToMapQuestFormat(searchTerm) {
		const parts = searchTerm.split(',');
		const city = parts[0];

		let allOtherParts = '';
		for (let i = 1; i < parts.length; i++) {
			const part = parts[i];
			allOtherParts += `${part}, `;
		}

		return `${allOtherParts}${city}, Hungary`;
	}
};
