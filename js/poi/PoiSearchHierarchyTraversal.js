module.exports = class PoiSearchHierarchyTraversal {
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
					throw new Error('Every top level element should have at least 1 child');
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

	getSelect2Hierarchy() {
		const select2Options = [];
		Object.entries(this.searchHierarchy).forEach((topLevelElement) => {
			const children = [];

			Object.entries(topLevelElement[1].children).forEach((childEntry) => {
				const childKey = childEntry[0];
				const child = childEntry[1];

				const object = {
					id: childKey,
					text: child.title,
				};

				if (Object.hasOwnProperty.call(child, 'alternativeSearchText')) {
					// eslint-disable-next-line prefer-destructuring
					object.alt = child.alternativeSearchText[0];
				}

				children.push(object);
			});

			select2Options.push({
				id: topLevelElement[0],
				text: topLevelElement[1].title,
				children,
			});
		});

		return select2Options;
	}
};
