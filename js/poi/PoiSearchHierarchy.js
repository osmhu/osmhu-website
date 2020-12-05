const poiSearchHierarchyData = require('./poiSearchHierarchyData');
const PoiSearchHierarchyTraversal = require('./PoiSearchHierarchyTraversal');

const poiSearchHierarchy = new PoiSearchHierarchyTraversal(poiSearchHierarchyData);

module.exports = class PoiSearchHierarchy {
	static getOverpassQueryById(searchId) {
		return poiSearchHierarchy.getOverpassQueryById(searchId);
	}

	static getHierarchy() {
		return poiSearchHierarchyData;
	}
};
