const present = require('present');
const Ajax = require('../Ajax');
const OverpassEndpoint = require('./OverpassEndpoint');

jest.mock('../Ajax');
jest.mock('present');

it('should ensure url has trailing slash', () => {
	expect(OverpassEndpoint.ensureUrlHasTrailingSlash('https://domain.test/api')).toEqual('https://domain.test/api/');
	expect(OverpassEndpoint.ensureUrlHasTrailingSlash('https://domain.test/api/')).toEqual('https://domain.test/api/');
});

it('should return the fastest endpoint', async () => {
	const fastestTestEndpoint = 'https://z.overpass-api.de/api/';

	const originalMeasureEndpointFn = OverpassEndpoint.measureEndpoint;
	OverpassEndpoint.measureEndpoint = jest.fn((endpoint) => {
		if (endpoint === fastestTestEndpoint) {
			return 100;
		}
		return 1000;
	});

	await OverpassEndpoint.measureEndpointLoadTimes();
	expect(OverpassEndpoint.measureEndpoint).toHaveBeenCalledTimes(OverpassEndpoint.all.length);
	expect(OverpassEndpoint.fastestEndpoint).toEqual(fastestTestEndpoint);

	// Reset mocking
	OverpassEndpoint.measureEndpoint = originalMeasureEndpointFn;
});

it('measure should call endpoint and calculate elapsed milliseconds for query', async () => {
	Ajax.mockReset();
	Ajax.get.mockResolvedValue({});

	present.mockReset();

	// Manipulate timer
	present.mockReturnValueOnce(1000) // start call
		.mockReturnValueOnce(1100); // +100 ms end call

	const elapsedMilliseconds = await OverpassEndpoint.measureEndpoint('http://test/');
	expect(present).toHaveBeenCalledTimes(2);
	expect(elapsedMilliseconds).toEqual(100);

	expect(Ajax.get).toHaveBeenCalledTimes(1);
	expect(Ajax.get).toHaveBeenCalledWith('http://test/interpreter?data=[out:json];node(47.48,19.02,47.5,19.05)["amenity"="cafe"];out;');
});
