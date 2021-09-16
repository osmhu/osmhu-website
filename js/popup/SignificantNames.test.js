import SignificantNames from './SignificantNames';

it('should return *Hely* as primaryName when no tags exist', () => {
	const significantNames = SignificantNames.generateFromTags({});

	expect(significantNames.primaryName).toEqual('Hely');
	expect(significantNames.secondaryName).toHaveLength(0);
});

it('should return name as primaryName when name tag exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		name: 'Név',
	});

	expect(significantNames.primaryName).toEqual('Név');
	expect(significantNames.secondaryName).toHaveLength(0);
});

it('should return ref as primaryName when ref tag exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		ref: 'M0',
	});

	expect(significantNames.primaryName).toEqual('M0');
	expect(significantNames.secondaryName).toHaveLength(0);
});

it('should return operator as primaryName when operator tag exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		operator: 'BKV',
	});

	expect(significantNames.primaryName).toEqual('BKV');
	expect(significantNames.secondaryName).toHaveLength(0);
});

it('should return name as primaryName when name and ref tag exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		name: 'Név',
		ref: 'M0',
	});

	expect(significantNames.primaryName).toEqual('Név');
	expect(significantNames.secondaryName).toHaveLength(0);
});

it('should return ref as primaryName when both ref and operator tags exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		ref: 'M0',
		operator: 'BKV',
	});

	expect(significantNames.primaryName).toEqual('M0');
	expect(significantNames.secondaryName).toHaveLength(0);
});

it('should return type as primaryName when no other tag exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		amenity: 'pub',
	});

	expect(significantNames.primaryName).toEqual('Kocsma');
	expect(significantNames.secondaryName).toHaveLength(0);
});

it('should return name as primaryName and type as secondary when those tags exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		name: 'testName',
		amenity: 'pub',
	});

	expect(significantNames.primaryName).toEqual('testName');
	expect(significantNames.secondaryName).toEqual('Kocsma');
});

it('should return ref as primaryName and type as secondary when those tags exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		ref: 'testReference',
		amenity: 'drinking_water',
	});

	expect(significantNames.primaryName).toEqual('testReference');
	expect(significantNames.secondaryName).toEqual('Ivóvíz');
});

it('should return operator as primaryName and type as secondary when those tags exist', () => {
	const significantNames = SignificantNames.generateFromTags({
		operator: 'testOperator',
		amenity: 'drinking_water',
	});

	expect(significantNames.primaryName).toEqual('testOperator');
	expect(significantNames.secondaryName).toEqual('Ivóvíz');
});

it('should return name and hungarian name in primaryName when both exist and differ', () => {
	const significantNames = SignificantNames.generateFromTags({
		name: 'testName',
		'name:hu': 'testHungarianName',
	});

	expect(significantNames.primaryName).toEqual('testName (testHungarianName)');
	expect(significantNames.secondaryName).toHaveLength(0);
});

it('should return name in primaryName when hungarian name exists, but same as name', () => {
	const significantNames = SignificantNames.generateFromTags({
		name: 'testName',
		'name:hu': 'testName',
	});

	expect(significantNames.primaryName).toEqual('testName');
	expect(significantNames.secondaryName).toHaveLength(0);
});
