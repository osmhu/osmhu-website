/* globals document */

const $ = require('jquery');

const PoiSearchHierarchy = require('./PoiSearchHierarchy');

module.exports = class PoiLayerSelector {
	constructor(poiLayers) {
		this.poiLayers = poiLayers;

		this.$root = $('.poi-layer-selector');

		this.$trigger = this.$root.find('.poi-layer-selector-trigger');
		this.$trigger.on('click', () => this.toggleOpened());
		this.$dropdown = this.$root.find('.poi-layer-selector-dropdown');

		this.$searchCategories = this.$root.find('.poi-layer-selector-categories');
		this.refreshButtonState();
		this.generateHierarchy();
		this.refreshTitle();
	}

	refreshButtonState() {
		const newIcon = this.isOpened() ? 'up' : 'down';

		this.$trigger.find('.poi-layer-selector-state').html(`<i class="fa fa-caret-${newIcon}">`);
	}

	refreshTitle() {
		const activeCount = this.poiLayers.getAllSearchIds().length;
		let newTitle = 'Helyek <span class="verbose">keresése</span>';
		if (activeCount > 0) {
			newTitle += `<span class="active-count">&nbsp;(${activeCount} aktív)</span>`;
		}
		this.$trigger.find('span.title').html(newTitle);
	}

	isOpened() {
		return this.$root.hasClass('opened');
	}

	close(event) {
		if (this.$root !== event.target && !this.$root.has(event.target).length) {
			this.$root.removeClass('opened');
			$(document).off('.background');
			this.refreshButtonState();
		}
	}

	toggleOpened() {
		if (this.isOpened()) {
			this.$root.removeClass('opened');
		} else {
			this.$root.addClass('opened');

			setTimeout(() => {
				$(document).on('click.background', event => this.close(event));
			}, 100);
		}
		this.refreshButtonState();
	}

	generateHierarchy() {
		this.$searchCategories.html('');

		Object.entries(PoiSearchHierarchy.getHierarchy()).forEach(([categoryId, category]) => {
			this.generateCategory(categoryId, category, this.$searchCategories);
		});
	}

	generateCategory(categoryId, category, parentToAppendTo) {
		const title = PoiLayerSelector.generateSearchCategoryTitle(category.title);

		const html = `
			<div class="poi-layer-selector-category">
				<span class="title">${title}</span>
				<div id="poi-layer-selector-category-toggles-${categoryId}" class="poi-layer-selector-category-toggles">
				</div>
			</div>
		`;

		parentToAppendTo.append(html);

		const $toggles = parentToAppendTo.find(`#poi-layer-selector-category-toggles-${categoryId}`);

		Object.entries(category.children).forEach(([searchId, searchObject]) => {
			this.appendSearchToggle(searchId, searchObject, $toggles);
		});
	}

	static generateSearchCategoryTitle(categoryTitle) {
		const html = `
			<div class="poi-layer-selector-category-title">
				<span>${categoryTitle}</span>
			</div>
		`;

		return html;
	}

	toggle(searchId) {
		const searchIdIsActive = this.poiLayers.getAllSearchIds().some(id => id === searchId);
		if (searchIdIsActive) {
			this.inactivate(searchId);
		} else {
			this.activate(searchId);
		}
	}

	getElementBySearchId(searchId) {
		return this.$dropdown.find(`#poi-layer-selector-toggle-${searchId}`);
	}

	inactivate(searchId) {
		this.getElementBySearchId(searchId).removeClass('active');
		this.poiLayers.removeBySearchId(searchId);
		this.refreshTitle();
	}

	activate(searchId) {
		this.getElementBySearchId(searchId).addClass('active');
		this.poiLayers.addBySearchId(searchId);
		this.refreshTitle();
	}

	appendSearchToggle(searchId, searchObject, parentToAppendTo) {
		const activeClass = this.poiLayers.getAllSearchIds().some(id => id === searchId) ? ' active' : '';
		const icon = '/kepek/mapicons/simple/' + searchObject.icon + '.png';

		const html = `
			<div id="poi-layer-selector-toggle-${searchId}" class="poi-layer-selector-toggle${activeClass}">
				<div class="poi-layer-selector-toggle-icon">
					<img src="${icon}" alt="${searchObject.title}" />
				</div>
				<div class="poi-layer-selector-toggle-title">
					<span>${searchObject.title}</span>
				</div>
			</div>
		`;

		parentToAppendTo.append(html);
		parentToAppendTo.find(`#poi-layer-selector-toggle-${searchId}`).on('click', () => this.toggle(searchId));
	}
};
