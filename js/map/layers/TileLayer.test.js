import L from 'leaflet';

import TileLayer from './TileLayer';

const createTileLayer = () => new TileLayer({
	id: 1,
	title: 'testTitle',
	layerId: 'OpenStreetMap.Mapnik',
});

test('getLeafletLayer returns valid Leafet L.tileLayer', () => {
	const tileLayer = createTileLayer();

	expect(tileLayer.getLeafletLayer()).toBeInstanceOf(L.TileLayer);
});

test('getLeafletLayer always returns the same object', () => {
	const tileLayer = createTileLayer();

	expect(tileLayer.getLeafletLayer()).toBe(tileLayer.getLeafletLayer());
});
