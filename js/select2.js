var $ = require('jquery');
window.jQuery = $; // Hack to make select2 work
require('select2');

const poiSearchHierarchyData = require('./poi/poiSearchHierarchyData');
const PoiSearchHierarchyTraversal = require('./poi/PoiSearchHierarchyTraversal');

const MobileDetector = require('./MobileDetector');
const PoiLayer = require('./poi/PoiLayer');

var select2 = module.exports = {};

const poiSearchHierarchy = new PoiSearchHierarchyTraversal(poiSearchHierarchyData);

var minimumResultsForSearch = null;
if (MobileDetector.isMobile()) {
	minimumResultsForSearch = -1;
}

select2.set = function (category) {
	$('#poi-search').select2('val', category);
};

select2.initialize = function () {
	$('#poi-search').select2({
		data: poiSearchHierarchy.getSelect2Hierarchy(),
		minimumResultsForSearch: minimumResultsForSearch,
		formatNoMatches: 'Nem található egyezés.',
		allowClear: true,
		dropdownCss: function () {
			if (MobileDetector.isMobile()) {
				var width = $('.select2-container').width() + 100;
				return {
					width: width + 'px'
				};
			}
		},
		matcher: function(term, text, opt) {
			return text.toUpperCase().indexOf(term.toUpperCase()) >= 0 ||
				(opt.alt && opt.alt.toUpperCase().indexOf(term.toUpperCase()) >= 0);
		}
	})
	.on('change', function (event) {
		PoiLayer.displayPoiLayer(window.map, event.val);
	})
	.on('select2-clearing', function () {
		PoiLayer.destroyActive();
	});
};

/**
 * Fix select2 bug: https://github.com/select2/select2/issues/2061
 * Do not allow dropdown to be closed for 250ms after opening
 */
var lastOpenTime;

$(window).on('select2-open', function (event) {
	lastOpenTime = new Date().getTime();
});

$(window).on('select2-close', function (event) {
	var tempCounter = new Date().getTime();

	if (lastOpenTime > tempCounter - 250) {
		$(event.target).select2('open');
	}
});
