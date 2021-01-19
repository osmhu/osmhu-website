import LayerList from './LayerList';
import Layer from './Layer';

test('constructor only accepts instances of Layer', () => {
	const invalidLayers = {};

	invalidLayers.testLayer = {};

	expect(() => {
		new LayerList(invalidLayers); // eslint-disable-line no-new
	}).toThrow();
});

test('can return values as {id}->{layer} hash', () => {
	const layers = {};

	layers.layerWithNumberId = new Layer(1, 'testName', 'testUrl');
	layers.layerWithStringId = new Layer('stringId', 'testName', 'testUrl');

	const testLayerList = new LayerList(layers);

	expect(testLayerList.getIdValueHash()).toEqual({
		1: layers.layerWithNumberId,
		stringId: layers.layerWithStringId,
	});
});

test('can return values as {displayname}->{layer} hash', () => {
	const layers = {};

	layers.testLayer = new Layer(1, 'testName', 'testUrl');
	layers.testLayer.maxZoom = 18;

	const testLayerList = new LayerList(layers);

	expect(testLayerList.getLeafletLayersByDisplayName()).toEqual({
		testName: layers.testLayer.getLayer(),
	});
});

test('can return all contained layer ids as array', () => {
	const layers = {};

	layers.layerOne = new Layer(6, 'testName', 'testUrl');
	layers.layerTwo = new Layer(84, 'testName', 'testUrl');

	const testLayerList = new LayerList(layers);

	expect(testLayerList.getAllIds()).toEqual([6, 84]);
});

test('can return layer by id', () => {
	const layerId = 'testLayerId';

	const layers = {};

	layers.layer1 = new Layer('string id 1', 'testName', 'testUrl');
	layers.searchedLayer = new Layer(layerId, 'testName', 'testUrl');
	layers.layer3 = new Layer('string id 2', 'testName', 'testUrl');

	const testLayerList = new LayerList(layers);

	expect(testLayerList.getById(layerId)).toEqual(layers.searchedLayer);
});

test('throw error if id is not present', () => {
	const invalidLayerId = 'invalidLayerId';

	const layers = {};

	layers.layer1 = new Layer('string id 1', 'testName', 'testUrl');
	layers.layer2 = new Layer('string id 2', 'testName', 'testUrl');

	const testLayerList = new LayerList(layers);

	expect(() => {
		testLayerList.getById(invalidLayerId);
	}).toThrow();
});
