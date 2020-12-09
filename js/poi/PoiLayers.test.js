const MockedMap = require('../map/test-helper/MockedMap');

const PoiLayers = require('./PoiLayers');

describe('PoiLayers', () => {
	let poiLayers;

	beforeAll(() => {
		const mockedMap = MockedMap.build(13, 47.49843, 19.04115);
		poiLayers = new PoiLayers(mockedMap);
	});

	describe('getAllSearchIds', () => {
		it('should return empty list when no layers have been added', () => {
			expect(poiLayers.getAllSearchIds()).toEqual([]);
		});

		it('should return layer when a layer have been added', () => {
			poiLayers.addBySearchId('restaurant');
			expect(poiLayers.getAllSearchIds()).toContain('restaurant');
		});

		it('should return layers when multiple layers have been added', () => {
			poiLayers.addBySearchId('restaurant');
			poiLayers.addBySearchId('cafe');
			expect(poiLayers.getAllSearchIds()).toContain('restaurant', 'cafe');
		});

		it('should return layers when adding then removing layers', () => {
			poiLayers.addBySearchId('restaurant');
			poiLayers.addBySearchId('atm');
			poiLayers.addBySearchId('cafe');
			expect(poiLayers.getAllSearchIds()).toContain('restaurant', 'atm', 'cafe');
			poiLayers.removeBySearchId('atm');
			expect(poiLayers.getAllSearchIds()).toContain('restaurant', 'cafe');
		});

		it('should return empty list when removing all added layers', () => {
			poiLayers.addBySearchId('restaurant');
			poiLayers.addBySearchId('atm');
			poiLayers.addBySearchId('cafe');
			expect(poiLayers.getAllSearchIds()).toContain('restaurant', 'atm', 'cafe');
			poiLayers.removeBySearchId('restaurant');
			poiLayers.removeBySearchId('atm');
			poiLayers.removeBySearchId('cafe');
			expect(poiLayers.getAllSearchIds()).toEqual([]);
		});

		it('should return empty list when removing all layers', () => {
			poiLayers.addBySearchId('restaurant');
			poiLayers.addBySearchId('atm');
			poiLayers.addBySearchId('cafe');
			expect(poiLayers.getAllSearchIds()).toContain('restaurant', 'atm', 'cafe');
			poiLayers.removeAll();
			expect(poiLayers.getAllSearchIds()).toEqual([]);
		});

		it('should not throw while removing a not added layer', () => {
			poiLayers.addBySearchId('restaurant');
			expect(poiLayers.getAllSearchIds()).toContain('restaurant');
			poiLayers.removeBySearchId('cafe');
			expect(poiLayers.getAllSearchIds()).toContain('restaurant');
		});
	});
});
