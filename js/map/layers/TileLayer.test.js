const L = require('leaflet');

const TileLayer = require('./TileLayer');

test('getLayer returns a valid L.tileLayer', () => {
	const tileLayer = new TileLayer(1, 'displayName', 'url', 'maxZoom');

	expect(tileLayer.getLayer()).toBeInstanceOf(L.TileLayer);
});

test('getLayer always returns the same object', () => {
	const tileLayer = new TileLayer(1, 'displayName', 'url', 'maxZoom');

	expect(tileLayer.getLayer()).toBe(tileLayer.getLayer());
});
