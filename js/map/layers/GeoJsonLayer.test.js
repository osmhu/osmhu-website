const L = require('leaflet');
const log = require('loglevel');

const Ajax = require('../../common/Ajax');

const GeoJsonLayer = require('./GeoJsonLayer');

jest.mock('../../common/Ajax');

const validGeoJson = JSON.stringify({
	type: 'Feature',
	geometry: {
		type: 'Point',
		coordinates: [125.6, 10.1],
	},
	properties: {
		name: 'Dinagat Islands',
	},
});

beforeEach(() => {
	Ajax.mockReset();
	Ajax.get.mockResolvedValue(validGeoJson);
	log.setLevel('silent');
});

afterEach(() => {
	jest.clearAllMocks();
});

test('getLayer returns a valid L.GeoJSON', () => {
	const geoJsonLayer = new GeoJsonLayer(1, 'displayName', 'testUrl');

	expect(geoJsonLayer.getLayer()).toBeInstanceOf(L.GeoJSON);
});

test('getLayer always returns the same object', () => {
	const geoJsonLayer = new GeoJsonLayer(1, 'displayName', 'testUrl');

	expect(geoJsonLayer.getLayer()).toBe(geoJsonLayer.getLayer());
});

test('should not download if getLayer is called', () => {
	const geoJsonLayer = new GeoJsonLayer(1, 'displayName', 'testUrl');

	geoJsonLayer.getLayer();

	expect(Ajax.get).toHaveBeenCalledTimes(0);
});

test('ensureLoaded should start download if not loaded yet', () => {
	const geoJsonLayer = new GeoJsonLayer(1, 'displayName', 'testUrl');

	geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);
});

test('ensureLoaded should not start download while loading', () => {
	Ajax.get.mockImplementation(() => new Promise((resolve) => {
		const id = setTimeout(() => {
			clearTimeout(id);
			resolve(validGeoJson);
		}, 2000);
	}));

	const geoJsonLayer = new GeoJsonLayer(1, 'displayName', 'testUrl');

	geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);

	geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);
});

test('ensureLoaded should not download same content if already downloaded', async () => {
	const geoJsonLayer = new GeoJsonLayer(1, 'displayName', 'testUrl');

	await geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);

	await geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);
});
