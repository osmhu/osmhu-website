const Autocomplete = require('./Autocomplete');

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
