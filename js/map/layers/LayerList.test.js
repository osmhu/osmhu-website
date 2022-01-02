import LayerList from './LayerList';
import Layer from './Layer';
import TileLayer from './TileLayer';

const createLayerListForLayerIds = (layerIds) => {
	const layerList = new LayerList();

	layerIds.forEach((layerId) => {
		layerList.addLayer(new Layer(layerId, 'testTitle'));
	});

	return layerList;
};

test('addLayer only accepts instance of Layer', () => {
	const layerList = new LayerList();

	expect(() => {
		layerList.addLayer({});
	}).toThrow();

	expect(() => {
		layerList.addLayer(new Layer('testId'));
	}).not.toThrow();
});

test('getTitleLeafletLayerMap returns {title}->{layer} map needed by Leaflet layers control', () => {
	const layerList = new LayerList();
	const layer = new TileLayer('testLayerId', 'testTitle');
	layerList.addLayer(layer);

	const leafletLayer = { test: 'mockedValue' };
	const getLeafletLayerSpy = jest.spyOn(layer, 'getLeafletLayer').mockImplementation(() => leafletLayer);

	const titleLeafletLayerMap = layerList.getTitleLeafletLayerMap();

	expect(getLeafletLayerSpy).toHaveBeenCalledTimes(1);
	expect(titleLeafletLayerMap).toEqual({
		testTitle: leafletLayer,
	});
});

test('getAllIds returns all contained layer ids', () => {
	const layerList = createLayerListForLayerIds(['testLayerId', 'anotherTestLayerId']);

	expect(layerList.getAllIds()).toEqual(['testLayerId', 'anotherTestLayerId']);
});

test('getById returns layer by id', () => {
	const layerList = createLayerListForLayerIds(['testLayerId', 'anotherLayerId']);

	const searchedLayer = new Layer('searchedLayerId');
	layerList.addLayer(searchedLayer);

	expect(layerList.getById('searchedLayerId')).toEqual(searchedLayer);
});

test('getById throws error when id is not present', () => {
	const layerList = createLayerListForLayerIds(['testLayerId', 'anotherLayerId']);

	expect(() => {
		layerList.getById('notExistingLayerId');
	}).toThrow();
});
