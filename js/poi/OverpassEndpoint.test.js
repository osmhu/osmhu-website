import present from 'present';

import Ajax from '../common/Ajax';

import OverpassEndpoint from './OverpassEndpoint';

jest.mock('../common/Ajax');
jest.mock('present');

beforeEach(() => {
	jest.restoreAllMocks();
	Ajax.mockReset();
	present.mockReset();
});

it('should return the fastest endpoint', async () => {
	const fastestTestEndpoint = 'https://z.overpass-api.de/api/';

	const measureEndpointLoadTimeSpy = jest.spyOn(OverpassEndpoint, 'measureEndpointLoadTime').mockImplementation((endpoint) => {
		if (endpoint === fastestTestEndpoint) {
			return 100;
		}
		return 1000;
	});

	await OverpassEndpoint.measureAllEndpointLoadTimes();
	expect(measureEndpointLoadTimeSpy).toHaveBeenCalledTimes(OverpassEndpoint.all.length);
	expect(OverpassEndpoint.fastestEndpoint).toEqual(fastestTestEndpoint);
});

it('measure should call endpoint and calculate elapsed milliseconds for query', async () => {
	Ajax.get.mockResolvedValue({});

	// Manipulate timer
	present.mockReturnValueOnce(1000) // start call
		.mockReturnValueOnce(1100); // +100 ms end call

	const elapsedMilliseconds = await OverpassEndpoint.measureEndpointLoadTime('http://test/');
	expect(present).toHaveBeenCalledTimes(2);
	expect(elapsedMilliseconds).toEqual(100);

	expect(Ajax.get).toHaveBeenCalledTimes(1);
	expect(Ajax.get).toHaveBeenCalledWith('http://test/interpreter?data=[out:json];node(47.48,19.02,47.5,19.05)["amenity"="cafe"];out;');
});
