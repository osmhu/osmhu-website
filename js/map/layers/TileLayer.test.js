import L from 'leaflet';

import TileLayer from './TileLayer';

const createTileLayer = () => new TileLayer(1, 'testTitle', 'OpenStreetMap.Mapnik');

test('getLeafletLayer returns valid Leafet L.tileLayer', () => {
	const tileLayer = createTileLayer();

	expect(tileLayer.getLeafletLayer()).toBeInstanceOf(L.TileLayer);
});

test('getLeafletLayer always returns the same object', () => {
	const tileLayer = createTileLayer();

	expect(tileLayer.getLeafletLayer()).toBe(tileLayer.getLeafletLayer());
});
