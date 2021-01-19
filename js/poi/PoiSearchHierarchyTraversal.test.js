import PoiSearchHierarchyTraversal from './PoiSearchHierarchyTraversal';

const testPoiSearchHierarchy = {
	fooddrink: {
		title: 'Vendéglátás',
		children: {
			restaurant: {
				title: 'Étterem',
				overpassQuery: [{
					amenity: 'restaurant',
				}],
			},
			fast_food: {
				title: 'Gyorsétterem',
				overpassQuery: [{
					amenity: 'fast_food',
				}],
			},
			cafe: {
				title: 'Kávézó',
				alternativeSearchText: ['Alternative'],
				overpassQuery: [{
					amenity: 'cafe',
				}],
			},
		},
	},
};

let testPoiSearchHierarchyTraversal;

beforeAll(() => {
	testPoiSearchHierarchyTraversal = new PoiSearchHierarchyTraversal(testPoiSearchHierarchy);
});

it('should return restaurant search', () => {
	expect(testPoiSearchHierarchyTraversal.getOverpassQueryById('restaurant')).toEqual([{
		amenity: 'restaurant',
	}]);
});

it('should return restaurant search', () => {
	expect(testPoiSearchHierarchyTraversal.getOverpassQueryById('fast_food')).toEqual([{
		amenity: 'fast_food',
	}]);
});

it('should return fooddrink search', () => {
	expect(testPoiSearchHierarchyTraversal.getOverpassQueryById('fooddrink')).toEqual([{
		amenity: 'restaurant',
	}, {
		amenity: 'fast_food',
	}, {
		amenity: 'cafe',
	}]);
});
