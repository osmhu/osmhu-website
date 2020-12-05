/* globals window, map */

const $ = require('jquery');
const Cookies = require('js-cookie');

const introductionHideOnLoadCookie = 'introduction-hidden';
const panelWidth = 262;
const animationOptions = { duration: 200,	queue: false };

module.exports = class Introduction {
	constructor(searchResults) {
		this.$panel = $('#introduction');
		this.$mapContainer = $('#map-container');
		this.$toggler = $('#introduction-toggler');
		this.searchResults = searchResults;
	}

	initUi() {
		this.$toggler.on('click', this.toggle.bind(this));

		$(window).on('search-results-show', this.overDrawn.bind(this));
		$(window).on('search-results-hide', this.overDrawnEnd.bind(this));

		// On load hide introduction if cookie is set
		const hideOnLoad = Cookies.get(introductionHideOnLoadCookie);
		if (hideOnLoad) {
			this.$panel.hide();
			this.$panel.css('left', '-' + panelWidth);
			this.$mapContainer.css('left', 0);
			this.$toggler.css('left', 0);
			this.changeTogglerIconToShow();
		} else {
			this.$toggler.css('left', panelWidth);
			this.changeTogglerIconToHide();
		}
	}

	changeTogglerIconToShow() {
		this.changeTogglerIcon('❱');
	}

	changeTogglerIconToHide() {
		this.changeTogglerIcon('❰');
	}

	changeTogglerIcon(icon) {
		this.$toggler.find('.toggler').html(icon);
	}

	isVisible() {
		return this.$panel.is(':visible');
	}

	toggle() {
		if (this.isVisible()) {
			Cookies.set(introductionHideOnLoadCookie, 'true');
			this.hide();
		} else {
			Cookies.remove(introductionHideOnLoadCookie);
			this.show();
		}
	}

	hide() {
		this.$panel.animate({
			left: '-' + panelWidth,
		}, {
			duration: 200,
			queue: false,
			complete: () => {
				this.$panel.hide();
			},
		});

		this.changeTogglerIconToShow();

		this.$toggler.animate({
			left: 0,
		}, animationOptions);

		const animateMap = !this.searchResults.isActive();
		if (animateMap) {
			this.$mapContainer.animate({
				left: 0,
			}, {
				duration: 200,
				queue: false,
				complete: () => {
					map.invalidateSize();
				},
			});
		}
	}

	show() {
		this.$panel.show();

		this.$panel.animate({
			left: 0,
		}, {
			duration: 200,
			queue: false,
			complete: () => {
				this.$toggler.css('left', panelWidth);
			},
		});

		this.changeTogglerIconToHide();

		this.$mapContainer.animate({
			left: panelWidth,
		}, animationOptions);
	}

	overDrawn() {
		this.$mapContainer.animate({
			left: panelWidth,
		}, {
			duration: 200,
			queue: false,
			complete: () => {
				map.invalidateSize();
			},
		});

		this.$toggler.hide();
	}

	overDrawnEnd() {
		if (!this.$panel.is(':visible')) {
			this.$mapContainer.animate({
				left: 0,
			}, {
				duration: 200,
				queue: false,
				complete: () => {
					map.invalidateSize();
					this.$toggler.show();
				},
			});
		} else {
			this.$toggler.show();
		}
	}
};
