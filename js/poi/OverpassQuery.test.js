import OsmElementId from '../common/OsmElementId';

import OverpassQuery from './OverpassQuery';

describe('overpass combined search query generator', () => {
	// Combined overpass queries can be tested at https://overpass-turbo.eu/

	it('should generate valid query with one tag', () => {
		expect(OverpassQuery.generateQuery([{
			amenity: 'restaurant',
		}])).toEqual('(node({{bbox}})["amenity"="restaurant"];way({{bbox}})["amenity"="restaurant"];rel({{bbox}})["amenity"="restaurant"];);out bb qt;');
	});

	it('should generate valid query with two tags', () => {
		expect(OverpassQuery.generateQuery([{
			leisure: 'sports_centre',
			sport: 'swimming',
		}])).toEqual('(node({{bbox}})["leisure"="sports_centre"]["sport"="swimming"];way({{bbox}})["leisure"="sports_centre"]["sport"="swimming"];rel({{bbox}})["leisure"="sports_centre"]["sport"="swimming"];);out bb qt;');
	});

	it('should generate valid query multiple search criteria', () => {
		expect(OverpassQuery.generateQuery(([{
			amenity: 'atm',
		}, {
			amenity: 'bank',
			atm: 'yes',
		}]))).toEqual('((node({{bbox}})["amenity"="atm"];node({{bbox}})["amenity"="bank"]["atm"="yes"];);(way({{bbox}})["amenity"="atm"];way({{bbox}})["amenity"="bank"]["atm"="yes"];);(rel({{bbox}})["amenity"="atm"];rel({{bbox}})["amenity"="bank"]["atm"="yes"];););out bb qt;');
	});
});

describe('overpass node search query part generator', () => {
	it('should generate valid query with one tag', () => {
		expect(OverpassQuery.generateQueryForNode([{
			amenity: 'restaurant',
		}])).toEqual('node({{bbox}})["amenity"="restaurant"];');
	});

	it('should generate valid query with two tags', () => {
		expect(OverpassQuery.generateQueryForNode([{
			leisure: 'sports_centre',
			sport: 'swimming',
		}])).toEqual('node({{bbox}})["leisure"="sports_centre"]["sport"="swimming"];');
	});

	it('should generate valid query with multiple search criteria', () => {
		expect(OverpassQuery.generateQueryForNode([{
			amenity: 'atm',
		}, {
			amenity: 'bank',
			atm: 'yes',
		}])).toEqual('(node({{bbox}})["amenity"="atm"];node({{bbox}})["amenity"="bank"]["atm"="yes"];);');
	});
});

describe('overpass way search query part generator', () => {
	it('should generate valid query with one tag', () => {
		expect(OverpassQuery.generateQueryForWay([{
			amenity: 'restaurant',
		}])).toEqual('way({{bbox}})["amenity"="restaurant"];');
	});

	it('should generate valid query with two tags', () => {
		expect(OverpassQuery.generateQueryForWay([{
			leisure: 'sports_centre',
			sport: 'swimming',
		}])).toEqual('way({{bbox}})["leisure"="sports_centre"]["sport"="swimming"];');
	});

	it('should generate valid query with multiple search criteria', () => {
		expect(OverpassQuery.generateQueryForWay([{
			amenity: 'atm',
		}, {
			amenity: 'bank',
			atm: 'yes',
		}])).toEqual('(way({{bbox}})["amenity"="atm"];way({{bbox}})["amenity"="bank"]["atm"="yes"];);');
	});
});

describe('overpass relation search query part generator', () => {
	it('should generate valid query with one tag', () => {
		expect(OverpassQuery.generateQueryForRelation([{
			amenity: 'restaurant',
		}])).toEqual('rel({{bbox}})["amenity"="restaurant"];');
	});

	it('should generate valid query with two tags', () => {
		expect(OverpassQuery.generateQueryForRelation([{
			leisure: 'sports_centre',
			sport: 'swimming',
		}])).toEqual('rel({{bbox}})["leisure"="sports_centre"]["sport"="swimming"];');
	});

	it('should generate valid query with multiple search criteria', () => {
		expect(OverpassQuery.generateQueryForRelation([{
			amenity: 'atm',
		}, {
			amenity: 'bank',
			atm: 'yes',
		}])).toEqual('(rel({{bbox}})["amenity"="atm"];rel({{bbox}})["amenity"="bank"]["atm"="yes"];);');
	});
});

it.each([
	{ type: 'node', id: 1, expectedQuery: 'interpreter?data=[out:json];(node(1););out geom qt 10000;' },
	{ type: 'way', id: 1, expectedQuery: 'interpreter?data=[out:json];(way(1););out geom qt 10000;' },
	{ type: 'relation', id: 1, expectedQuery: 'interpreter?data=[out:json];(relation(1););out geom qt 10000;' },
])('should generate overpass query for $type', ({ type, id, expectedQuery }) => {
	const actualQuery = OverpassQuery.generateQueryByOsmElementId(new OsmElementId(type, id));

	expect(actualQuery).toEqual(expectedQuery);
});
