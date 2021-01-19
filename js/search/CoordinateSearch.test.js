import CoordinateSearch from './CoordinateSearch';

test('converter should handle GPS coordinates in the form of lat, lon', () => {
	const { lat, lon } = CoordinateSearch.convertToLatLon('47.7544, 18.5620');

	expect(lat).toBeCloseTo(47.7544);
	expect(lon).toBeCloseTo(18.5620);
});

test('converter should handle GPS coordinates in scientific degree unit', () => {
	const { lat, lon } = CoordinateSearch.convertToLatLon('47° 29′ 53″, 19° 02′ 24″');

	expect(lat).toBeCloseTo(47.4980556);
	expect(lon).toBeCloseTo(19.04);
});
