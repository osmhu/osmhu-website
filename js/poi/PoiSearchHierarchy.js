import poiSearchHierarchyData from './poiSearchHierarchyData';
import PoiSearchHierarchyTraversal from './PoiSearchHierarchyTraversal';

const poiSearchHierarchy = new PoiSearchHierarchyTraversal(poiSearchHierarchyData);

export default class PoiSearchHierarchy {
	static getOverpassQueryById(searchId) {
		return poiSearchHierarchy.getOverpassQueryById(searchId);
	}

	static getHierarchy() {
		return poiSearchHierarchyData;
	}
}
