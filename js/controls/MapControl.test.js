const L = require('leaflet');
const MapControl = require('./MapControl');

test('constructor only accepts instance of L.Control', () => {
	const notControl = {};

	expect(() => {
		new MapControl(notControl); // eslint-disable-line no-new
	}).toThrow();
});

test('can return control given to constructor', () => {
	const leafletControl = new L.Control({});

	const testControl = new MapControl(leafletControl);

	expect(testControl.getMapControl()).toBe(leafletControl);
});
