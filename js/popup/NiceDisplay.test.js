import NiceDisplay from './NiceDisplay';

describe('names', () => {
	it('should return *Hely* as primaryName when no tags exist', () => {
		expect(NiceDisplay.names({})).toEqual({
			primaryName: 'Hely',
		});
	});

	it('should return name as primaryName when name tag exist', () => {
		const tags = {
			name: 'Név',
		};
		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'Név',
		});
	});

	it('should return ref as primaryName when ref tag exist', () => {
		const tags = {
			ref: 'M0',
		};
		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'M0',
		});
	});

	it('should return operator as primaryName when operator tag exist', () => {
		const tags = {
			operator: 'BKV',
		};
		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'BKV',
		});
	});

	it('should return name as primaryName when name and ref tag exist', () => {
		const tags = {
			name: 'Név',
			ref: 'M0',
		};
		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'Név',
		});
	});

	it('should return ref as primaryName when ref and operator tag exist', () => {
		const tags = {
			ref: 'M0',
			operator: 'BKV',
		};
		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'M0',
		});
	});

	it('should return type as primaryName when no other tag exist', () => {
		const tags = {
			amenity: 'pub',
		};

		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'Kocsma',
		});
	});

	it('should return name as primaryName and type as secondary when those tags exist', () => {
		const tags = {
			name: 'Név',
			amenity: 'pub',
		};

		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'Név',
			secondaryName: 'Kocsma',
		});
	});

	it('should return ref as primaryName and type as secondary when those tags exist', () => {
		const tags = {
			ref: 'testReference',
			amenity: 'drinking_water',
		};

		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'testReference',
			secondaryName: 'Ivóvíz',
		});
	});

	it('should return operator as primaryName and type as secondary when those tags exist', () => {
		const tags = {
			operator: 'testOperator',
			amenity: 'drinking_water',
		};

		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'testOperator',
			secondaryName: 'Ivóvíz',
		});
	});

	it('should return name and hungarian name in primaryName when both exist and differ', () => {
		const tags = {
			name: 'testName',
			'name:hu': 'testHungarianName',
		};

		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'testName (testHungarianName)',
		});
	});

	it('should return name in primaryName when hungarian name exists, but same as name', () => {
		const tags = {
			name: 'testName',
			'name:hu': 'testName',
		};

		expect(NiceDisplay.names(tags)).toEqual({
			primaryName: 'testName',
		});
	});
});

describe('address', () => {
	it('should throw Error when no tag exists', () => {
		expect(() => {
			NiceDisplay.address({});
		}).toThrowError('Necessary tags missing');
	});

	it('should throw Error when only housenumber tag exists', () => {
		const tags = {
			'addr:housenumber': '9',
		};
		expect(() => {
			NiceDisplay.address(tags);
		}).toThrowError('Necessary tags missing');
	});

	it('should return city when no other tag exists', () => {
		const tags = {
			'addr:city': 'Kecskemét',
		};
		expect(NiceDisplay.address(tags)).toEqual('Kecskemét');
	});

	it('should return city when only city and housenumber tags exist', () => {
		const tags = {
			'addr:city': 'Kecskemét',
			'addr:housenumber': '1',
		};
		expect(NiceDisplay.address(tags)).toEqual('Kecskemét');
	});

	it('should return street when no other tag exists', () => {
		const tags = {
			'addr:street': 'Kossuth tér',
		};
		expect(NiceDisplay.address(tags)).toEqual('Kossuth tér');
	});

	it('should return street and housenumber when city tag does not exist', () => {
		const tags = {
			'addr:street': 'Kossuth tér',
			'addr:housenumber': '1',
		};
		expect(NiceDisplay.address(tags)).toEqual('Kossuth tér 1.');
	});

	it('should return city and street when only these tags exist', () => {
		const tags = {
			'addr:city': 'Kecskemét',
			'addr:street': 'Kossuth tér',
		};
		expect(NiceDisplay.address(tags)).toEqual('Kecskemét, Kossuth tér');
	});

	it('should return city, street and housenumber with a point, when these tags exist', () => {
		const tags = {
			'addr:city': 'Kecskemét',
			'addr:street': 'Kossuth tér',
			'addr:housenumber': '1',
		};
		expect(NiceDisplay.address(tags)).toEqual('Kecskemét, Kossuth tér 1.');
	});

	it('should return city, street and housenumber when these tags exist', () => {
		const tags = {
			'addr:city': 'Kecskemét',
			'addr:street': 'Kossuth tér',
			'addr:housenumber': '1/b',
		};
		expect(NiceDisplay.address(tags)).toEqual('Kecskemét, Kossuth tér 1/b');
	});
});
