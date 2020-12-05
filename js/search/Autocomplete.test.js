const Ajax = require('../common/Ajax');

const Autocomplete = require('./Autocomplete');

jest.mock('../common/Ajax');

beforeEach(() => {
	Ajax.mockReset();
});

afterEach(() => {
	jest.clearAllMocks();
});

test('getCenterCoordinatesByCityName should return coordinates if query returned valid coordinates', async () => {
	const validCoordinates = { lat: 46.90808, lon: 19.69281 };
	Ajax.getWithParams.mockResolvedValue(validCoordinates);

	await expect(Autocomplete.getCenterCoordinatesByCityName('mocked')).resolves.toEqual(validCoordinates);
	expect(Ajax.getWithParams).toHaveBeenCalledTimes(1);
	expect(Ajax.getWithParams).toHaveBeenLastCalledWith('/query/coordinates.php', { name: 'mocked' });
});

test('getCenterCoordinatesByCityName should throw error if query returned invalid coordinates', async () => {
	Ajax.getWithParams.mockResolvedValue({ invalidResponse: true });

	await expect(Autocomplete.getCenterCoordinatesByCityName('mocked')).rejects.toThrow();
	expect(Ajax.getWithParams).toHaveBeenCalledTimes(1);
	expect(Ajax.getWithParams).toHaveBeenLastCalledWith('/query/coordinates.php', { name: 'mocked' });
});

test('processSelection should set field value if city is given', async () => {
	Autocomplete.getCenterCoordinatesByCityName = jest.fn(() => ({ lat: 46.90808, lon: 19.69281 }));

	const map = {
		setView: jest.fn(),
	};

	const autocompleteInstance = new Autocomplete(map);
	autocompleteInstance.setFieldValue = jest.fn();

	await expect(autocompleteInstance.processSelection(1, 'Kecskemét')).resolves;
	expect(autocompleteInstance.setFieldValue).toHaveBeenCalledTimes(1);
	expect(autocompleteInstance.setFieldValue).toHaveBeenCalledWith('Kecskemét, ');
});

test('processSelection should call map.setView() with coordinates if selected item is city', async () => {
	Autocomplete.getCenterCoordinatesByCityName = jest.fn(() => ({ lat: 46.90808, lon: 19.69281 }));

	const map = {
		setView: jest.fn(),
	};

	const autocompleteInstance = new Autocomplete(map);

	await expect(autocompleteInstance.processSelection(1, 'Kecskemét')).resolves;
	expect(map.setView).toHaveBeenLastCalledWith([46.90808, 19.69281], 14);
});

test('processSelection should call map.focusWay() if selected item is street', async () => {
	const map = {
		focusWay: jest.fn(),
	};

	const autocompleteInstance = new Autocomplete(map);

	await expect(autocompleteInstance.processSelection(12345, 'Kecskemét, Fő utca')).resolves;
	expect(map.focusWay).toHaveBeenLastCalledWith(12345);
});

test('search should get results with Ajax when searching city', async () => {
	const resultCities = [{ id: 1, value: 'Test city' }, { id: 2, value: 'Test city 2' }];
	Ajax.getWithParams.mockResolvedValue(resultCities);

	await expect(Autocomplete.search('city')).resolves.toEqual([{ value: resultCities[0] }, { value: resultCities[1] }]);
	expect(Ajax.getWithParams).toHaveBeenCalledTimes(1);
	expect(Ajax.getWithParams).toHaveBeenLastCalledWith('/query/cities.php', { term: 'city' });
});

test('search should get results with Ajax when searching street', async () => {
	const resultStreets = [{ id: 1, name: 'Test street' }, { id: 2, name: 'Test street 2' }];
	Ajax.getWithParams.mockResolvedValue(resultStreets);

	await expect(Autocomplete.search('City, street')).resolves.toEqual([
		{ id: 1, value: 'City, Test street' },
		{ id: 2, value: 'City, Test street 2' },
	]);
	expect(Ajax.getWithParams).toHaveBeenCalledTimes(1);
	expect(Ajax.getWithParams).toHaveBeenLastCalledWith('/query/streets.php', { city: 'City', term: 'street' });
});

test('niceCityName should return nice city names', () => {
	expect(Autocomplete.niceCityName('Budapest')).toEqual('Budapest');
	expect(Autocomplete.niceCityName('budapest')).toEqual('Budapest');
	expect(Autocomplete.niceCityName('budaPest')).toEqual('Budapest');
	expect(Autocomplete.niceCityName('BudaPest')).toEqual('Budapest');
	expect(Autocomplete.niceCityName('BUDAPEST')).toEqual('Budapest');
	expect(Autocomplete.niceCityName('budapest X')).toEqual('Budapest X');
	expect(Autocomplete.niceCityName('budapest XII.')).toEqual('Budapest XII.');
	expect(Autocomplete.niceCityName('Budapest XII.')).toEqual('Budapest XII.');
	expect(Autocomplete.niceCityName('budaPest XII.')).toEqual('Budapest XII.');
	expect(Autocomplete.niceCityName('BudaPest XII.')).toEqual('Budapest XII.');
	expect(Autocomplete.niceCityName('BUDAPEST XII.')).toEqual('Budapest XII.');
	expect(Autocomplete.niceCityName('Kecskemét')).toEqual('Kecskemét');
	expect(Autocomplete.niceCityName('kecskemét')).toEqual('Kecskemét');
	expect(Autocomplete.niceCityName('kecsKemét')).toEqual('Kecskemét');
	expect(Autocomplete.niceCityName('KECSKEMÉT')).toEqual('Kecskemét');
});

test('splitQuery should split query into city and street', () => {
	expect(Autocomplete.splitQuery('')).toEqual({ city: '' });
	expect(Autocomplete.splitQuery('B')).toEqual({ city: 'B' });
	expect(Autocomplete.splitQuery('Budapest')).toEqual({ city: 'Budapest' });
	expect(Autocomplete.splitQuery('Budapest ')).toEqual({ city: 'Budapest' });
	expect(Autocomplete.splitQuery('Budapest I')).toEqual({ city: 'Budapest I' });
	expect(Autocomplete.splitQuery('Budapest I,')).toEqual({ city: 'Budapest I', street: '' });
	expect(Autocomplete.splitQuery('Budapest I.,')).toEqual({ city: 'Budapest I.', street: '' });
	expect(Autocomplete.splitQuery('Budapest I.,Alagút utca')).toEqual({ city: 'Budapest I.', street: 'Alagút utca' });
	expect(Autocomplete.splitQuery('Budapest I. Alagút utca')).toEqual({ city: 'Budapest I.', street: 'Alagút utca' });
	expect(Autocomplete.splitQuery('Budapest I., Alagút utca')).toEqual({ city: 'Budapest I.', street: 'Alagút utca' });
	expect(Autocomplete.splitQuery('Budapest V')).toEqual({ city: 'Budapest V' });
	expect(Autocomplete.splitQuery('Budapest L')).toEqual({ city: 'Budapest', street: 'L' });
	expect(Autocomplete.splitQuery('Budapest IX')).toEqual({ city: 'Budapest IX' });
	expect(Autocomplete.splitQuery('Budapest XI')).toEqual({ city: 'Budapest XI' });
	expect(Autocomplete.splitQuery('Budapest XI.')).toEqual({ city: 'Budapest XI.' });
	expect(Autocomplete.splitQuery('Budapest XII. Abigél utca')).toEqual({ city: 'Budapest XII.', street: 'Abigél utca' });
	expect(Autocomplete.splitQuery('Budapest XII., Abigél utca')).toEqual({ city: 'Budapest XII.', street: 'Abigél utca' });
	expect(Autocomplete.splitQuery('Kecskemét')).toEqual({ city: 'Kecskemét' });
	expect(Autocomplete.splitQuery('Kecskemét ')).toEqual({ city: 'Kecskemét', street: '' });
	expect(Autocomplete.splitQuery('Kecskemét,')).toEqual({ city: 'Kecskemét', street: '' });
	expect(Autocomplete.splitQuery('Kecskemét, ')).toEqual({ city: 'Kecskemét', street: '' });
	expect(Autocomplete.splitQuery('Kecskemét Ady')).toEqual({ city: 'Kecskemét', street: 'Ady' });
	expect(Autocomplete.splitQuery('Kecskemét, Ady')).toEqual({ city: 'Kecskemét', street: 'Ady' });
});
