const PoiLayer = require('./PoiLayer');

const MapMockFactory = require('../map/test-helper/MapMockFactory');

describe('poi display layer', () => {
	it('should throw error getting active search id when nothing has been displayed', () => {
		expect(() => {
			PoiLayer.getActivePoiLayerSearchId();
		}).toThrowError('No active poi layer');
	});

	it('should return latest searchId as active search id', () => {
		const mockedMap = MapMockFactory.build(13, 47.49843, 19.04115);
		PoiLayer.displayPoiLayer(mockedMap, 'testSearchId');
		expect(PoiLayer.getActivePoiLayerSearchId()).toEqual('testSearchId');
	});
});
