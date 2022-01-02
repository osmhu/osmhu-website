import L from 'leaflet';
import log from 'loglevel';

import Ajax from '../../common/Ajax';

import GeoJsonLayer from './GeoJsonLayer';

jest.mock('../../common/Ajax');

const validGeoJson = {
	type: 'Feature',
	geometry: {
		type: 'Point',
		coordinates: [125.6, 10.1],
	},
	properties: {
		name: 'Dinagat Islands',
	},
};

let originalLogLevel;

beforeAll(() => {
	originalLogLevel = log.getLevel();
	log.setLevel('silent');
});

beforeEach(() => {
	Ajax.mockReset();
	Ajax.get.mockResolvedValue(validGeoJson);
});

afterEach(() => {
	jest.clearAllMocks();
});

afterAll(() => {
	log.setLevel(originalLogLevel);
});

const createGeoJsonLayer = () => new GeoJsonLayer(1, 'testTitle', 'testUrl');

test('getLeafletLayer returns valid Leaflet L.GeoJSON', () => {
	const geoJsonLayer = createGeoJsonLayer();

	expect(geoJsonLayer.getLeafletLayer()).toBeInstanceOf(L.GeoJSON);
});

test('getLeafletLayer always returns the same object', () => {
	const geoJsonLayer = createGeoJsonLayer();

	expect(geoJsonLayer.getLeafletLayer()).toBe(geoJsonLayer.getLeafletLayer());
});

test('should not download if getLeafletLayer is called', () => {
	const geoJsonLayer = createGeoJsonLayer();

	geoJsonLayer.getLeafletLayer();

	expect(Ajax.get).toHaveBeenCalledTimes(0);
});

test('ensureLoaded should start download if not loaded yet', () => {
	const geoJsonLayer = createGeoJsonLayer();

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

	const geoJsonLayer = createGeoJsonLayer();

	geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);

	geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);
});

test('ensureLoaded should not download same content if already downloaded', async () => {
	const geoJsonLayer = createGeoJsonLayer();

	await geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);

	await geoJsonLayer.ensureLoaded();

	expect(Ajax.get).toHaveBeenCalledTimes(1);
});
