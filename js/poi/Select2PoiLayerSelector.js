/* deprecated */
/* global window */

const log = require('loglevel');
const $ = require('jquery');

window.jQuery = $; // Hack to make select2 work
require('select2');

const StringUtil = require('../common/StringUtil');
const MobileDetector = require('../MobileDetector');
const PoiSearchHierarchy = require('./PoiSearchHierarchy');

module.exports = class Select2PoiLayerSelector {
	constructor(poiLayers) {
		this.poiLayers = poiLayers;
		this.$select2 = $('#poi-search');

		this.init();
		this.fixSelect2Bug();
	}

	init() {
		const searchVisible = !MobileDetector.isMobile();

		this.$select2.select2({
			data: PoiSearchHierarchy.getSelect2Hierarchy(),
			minimumResultsForSearch: searchVisible ? null : -1,
			formatNoMatches: 'Nem található egyezés.',
			allowClear: true,
			dropdownCss: () => {
				if (MobileDetector.isMobile()) {
					const width = $('.select2-container').width() + 100;
					return {
						width: width + 'px',
					};
				}
				return {};
			},
			// eslint-disable-next-line arrow-body-style
			matcher: (term, text, opt) => {
				return StringUtil.ignoreCaseMatch(text, term)
					|| (opt.alt && StringUtil.ignoreCaseMatch(opt.alt, term));
			},
		})
			.on('change', (event) => {
				this.poiLayers.removeAll();
				this.poiLayers.addBySearchId(event.val);
			})
			.on('select2-clearing', () => {
				this.poiLayers.removeAll();
			});
	}

	setSelected(selectedIds) {
		if (selectedIds.length !== 1) {
			log.error('selecting multiple poi layers is not supported by select2 selector');
			throw new Error('selecting multiple poi layers is not supported by select2 selector');
		}

		this.$select2.select2('val', selectedIds[0]);
	}

	/**
	 * Fix select2 bug: https://github.com/select2/select2/issues/2061
	 * Do not allow dropdown to be closed for 250ms after opening
	 */
	fixSelect2Bug() {
		this.$select2.on('select2-open', () => {
			this.lastOpenTime = new Date().getTime();
		});

		this.$select2.on('select2-close', (event) => {
			const currentTime = new Date().getTime();

			if (this.lastOpenTime > currentTime - 250) {
				$(event.target).select2('open');
			}
		});
	}
};
