const poiSearchHierarchyData = require('./poiSearchHierarchyData');
const PoiSearchHierarchyTraversal = require('./PoiSearchHierarchyTraversal');

const poiSearchHierarchy = new PoiSearchHierarchyTraversal(poiSearchHierarchyData);

module.exports = class PoiSearchHierarchy {
	static getSelect2Hierarchy() {
		return poiSearchHierarchy.getSelect2Hierarchy();
	}

	static getOverpassQueryById(searchId) {
		return poiSearchHierarchy.getOverpassQueryById(searchId);
	}
};
