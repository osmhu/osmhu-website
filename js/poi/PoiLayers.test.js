import MockedMap from '../map/test-helper/MockedMap';

import PoiLayers from './PoiLayers';

jest.mock('../popup/PopupHtmlCreator.worker.js');

describe('PoiLayers', () => {
	let poiLayers;

	beforeAll(() => {
		const mockedMap = MockedMap.build(13, 47.49843, 19.04115);
		poiLayers = new PoiLayers(mockedMap);
	});

	describe('getAllLayerIds', () => {
		it('should return empty list when no layers have been added', () => {
			expect(poiLayers.getAllLayerIds()).toEqual([]);
		});

		it('should return layer when a layer have been added', () => {
			poiLayers.add('restaurant');
			expect(poiLayers.getAllLayerIds()).toContain('restaurant');
		});

		it('should return layers when multiple layers have been added', () => {
			poiLayers.add('restaurant');
			poiLayers.add('cafe');
			expect(poiLayers.getAllLayerIds()).toContain('restaurant', 'cafe');
		});

		it('should return layers when adding then removing layers', () => {
			poiLayers.add('restaurant');
			poiLayers.add('atm');
			poiLayers.add('cafe');
			expect(poiLayers.getAllLayerIds()).toContain('restaurant', 'atm', 'cafe');
			poiLayers.remove('atm');
			expect(poiLayers.getAllLayerIds()).toContain('restaurant', 'cafe');
		});

		it('should return empty list when removing all added layers', () => {
			poiLayers.add('restaurant');
			poiLayers.add('atm');
			poiLayers.add('cafe');
			expect(poiLayers.getAllLayerIds()).toContain('restaurant', 'atm', 'cafe');
			poiLayers.remove('restaurant');
			poiLayers.remove('atm');
			poiLayers.remove('cafe');
			expect(poiLayers.getAllLayerIds()).toEqual([]);
		});

		it('should return empty list when removing all layers', () => {
			poiLayers.add('restaurant');
			poiLayers.add('atm');
			poiLayers.add('cafe');
			expect(poiLayers.getAllLayerIds()).toContain('restaurant', 'atm', 'cafe');
			poiLayers.removeAll();
			expect(poiLayers.getAllLayerIds()).toEqual([]);
		});

		it('should not throw while removing a not added layer', () => {
			poiLayers.add('restaurant');
			expect(poiLayers.getAllLayerIds()).toContain('restaurant');
			poiLayers.remove('cafe');
			expect(poiLayers.getAllLayerIds()).toContain('restaurant');
		});
	});
});
