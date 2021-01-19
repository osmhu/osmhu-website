export default class PoiSearchHierarchyTraversal {
	constructor(searchHierarchy) {
		this.searchHierarchy = searchHierarchy;
	}

	getOverpassQueryById(id) {
		let overpassQuery = [];

		Object.entries(this.searchHierarchy).forEach(([topLevelElementKey, topLevelElement]) => {
			if (id === topLevelElementKey) {
				Object.values(topLevelElement.children).forEach((child) => {
					child.overpassQuery.forEach((query) => {
						overpassQuery.push(query);
					});
				});
			} else {
				const hasChildrenProperty = Object.prototype.hasOwnProperty.call(topLevelElement, 'children');
				if (!hasChildrenProperty || topLevelElement.children.length < 1) {
					throw new Error('Top level element ' + id + ' does not have at least 1 child');
				}

				Object.entries(topLevelElement.children).forEach(([childKey, child]) => {
					if (childKey === id) {
						// eslint-disable-next-line prefer-destructuring
						overpassQuery = child.overpassQuery;
					}
				});
			}
		});

		return overpassQuery;
	}
}
