const L = require('leaflet');

const Coordinate = require('./Coordinate');

describe('center from bounds', () => {
	it('should return same coordinates when southWest and northEast are the same', () => {
		const testBounds = new L.LatLngBounds([46.8993004, 19.6742287], [46.8993004, 19.6742287]);
		const expectedCenter = new L.LatLng(46.8993004, 19.6742287);
		expect(Coordinate.getCenterFromBounds(testBounds)).toEqual(expectedCenter);
	});

	it('should return center of bounds', () => {
		const testBounds = new L.LatLngBounds([46.9204404, 19.6968682], [46.920602, 19.696999]);
		const expectedCenter = new L.LatLng(46.920521199999996, 19.6969336);
		expect(Coordinate.getCenterFromBounds(testBounds)).toEqual(expectedCenter);
	});
});

describe('bounds from overpass result', () => {
	it('should match coordinates of overpass result for node', () => {
		const testOverpassNodeResult = {
			type: 'node',
			lat: 46.8993004,
			lon: 19.6742287,
		};
		const expectedBounds = new L.LatLngBounds([46.8993004, 19.6742287], [46.8993004, 19.6742287]);
		expect(Coordinate.getBoundsFromOverpassResult(testOverpassNodeResult)).toEqual(expectedBounds);
	});

	it('should be extracted from way', () => {
		const testOverpassWayResult = {
			type: 'way',
			bounds: {
				minlat: 46.9602811,
				minlon: 19.7249229,
				maxlat: 46.9604380,
				maxlon: 19.7251544,
			},
		};
		const expectedBounds = new L.LatLngBounds([46.9602811, 19.7249229], [46.9604380, 19.7251544]);
		expect(Coordinate.getBoundsFromOverpassResult(testOverpassWayResult)).toEqual(expectedBounds);
	});

	it('should be extracted from relation', () => {
		const testOverpassRelationResult = {
			type: 'relation',
			bounds: {
				minlat: 46.9637858,
				minlon: 19.7262782,
				maxlat: 46.9652594,
				maxlon: 19.7283484,
			},
		};
		const expectedBounds = new L.LatLngBounds([46.9637858, 19.7262782], [46.9652594, 19.7283484]);
		expect(Coordinate.getBoundsFromOverpassResult(testOverpassRelationResult)).toEqual(expectedBounds);
	});
});

it('should calculate center for overpass node result', () => {
	const testOverpassNodeResult = {
		type: 'node',
		lat: 46.8993004,
		lon: 19.6742287,
	};

	expect(Coordinate.getCenterPositionOfOverpassResult(testOverpassNodeResult))
		.toEqual(new L.LatLng(46.8993004, 19.6742287));
});

it('should calculate center for overpass node result', () => {
	const testOverpassWayResult = {
		type: 'way',
		bounds: {
			minlat: 46.9602811,
			minlon: 19.7249229,
			maxlat: 46.9604380,
			maxlon: 19.7251544,
		},
	};

	expect(Coordinate.getCenterPositionOfOverpassResult(testOverpassWayResult))
		.toEqual(new L.LatLng(46.96035955000001, 19.725038650000002));
});

it('should calculate center for overpass relation result without admin_centre', () => {
	const testOverpassRelationResult = {
		type: 'relation',
		bounds: {
			minlat: 46.9637858,
			minlon: 19.7262782,
			maxlat: 46.9652594,
			maxlon: 19.7283484,
		},
		members: [{}],
	};

	expect(Coordinate.getCenterPositionOfOverpassResult(testOverpassRelationResult))
		.toEqual(new L.LatLng(46.964522599999995, 19.7273133));
});

it('should calculate center for overpass relation result with admin_centre', () => {
	const testOverpassRelationResult = {
		type: 'relation',
		bounds: {
			minlat: 46.9637858,
			minlon: 19.7262782,
			maxlat: 46.9652594,
			maxlon: 19.7283484,
		},
		members: [{
			type: 'node',
			role: 'admin_centre',
			lat: 46.8993004,
			lon: 19.6742287,
		}],
	};

	expect(Coordinate.getCenterPositionOfOverpassResult(testOverpassRelationResult))
		.toEqual(new L.LatLng(46.8993004, 19.6742287));
});
