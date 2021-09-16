import log from 'loglevel';

import OsmElement from '../common/OsmElement';
import OsmElementId from '../common/OsmElementId';

import PoiRelevantContent from './PoiRelevantContent';

beforeAll(() => {
	log.setLevel('silent');
});

const createOsmElementWithTags = (tags) => {
	const osmElementId = new OsmElementId('node', 1);
	return new OsmElement(osmElementId, tags);
};

it.each([
	{ type: 'node', id: 1 },
	{ type: 'node', id: 100 },
	{ type: 'way', id: 2 },
	{ type: 'way', id: -200 },
	{ type: 'relation', id: 3 },
	{ type: 'relation', id: -300 },
])('sets type, id and name for $type $id', (testTable) => {
	const osmElementId = new OsmElementId(testTable.type, testTable.id);
	const osmElement = new OsmElement(osmElementId, {
		name: 'TestName',
	});
	const poiRelevantContent = PoiRelevantContent.createFromOsmElement(osmElement);

	expect(poiRelevantContent.osmElementId).toEqual(osmElementId);
	expect(poiRelevantContent.primaryName).toEqual('TestName');
});

describe('address parsing', () => {
	it('should throw Error when no tag exists', () => {
		const address = PoiRelevantContent.parseAddress(createOsmElementWithTags({}));

		expect(address.displayable).toEqual(false);
	});

	it('should throw Error when only housenumber tag exists', () => {
		const address = PoiRelevantContent.parseAddress(createOsmElementWithTags({
			'addr:housenumber': '9',
		}));

		expect(address.displayable).toEqual(false);
	});

	it('should return city when no other tag exists', () => {
		const address = PoiRelevantContent.parseAddress(createOsmElementWithTags({
			'addr:city': 'testCity',
		}));

		expect(address.displayable).toEqual(true);
		expect(address.city).toEqual('testCity');
		expect(address.street).toHaveLength(0);
		expect(address.housenumber).toHaveLength(0);
	});

	it('should return city when only city and housenumber tags exist', () => {
		const address = PoiRelevantContent.parseAddress(createOsmElementWithTags({
			'addr:city': 'testCity',
			'addr:housenumber': '1',
		}));

		expect(address.displayable).toEqual(true);
		expect(address.city).toEqual('testCity');
		expect(address.street).toHaveLength(0);
		expect(address.housenumber).toEqual('1');
	});

	it('should return street when no other tag exists', () => {
		const address = PoiRelevantContent.parseAddress(createOsmElementWithTags({
			'addr:street': 'Kossuth tér',
		}));

		expect(address.displayable).toEqual(true);
		expect(address.city).toHaveLength(0);
		expect(address.street).toEqual('Kossuth tér');
		expect(address.housenumber).toHaveLength(0);
	});

	it('should return street and housenumber when city tag does not exist', () => {
		const address = PoiRelevantContent.parseAddress(createOsmElementWithTags({
			'addr:street': 'Kossuth tér',
			'addr:housenumber': '1',
		}));

		expect(address.displayable).toEqual(true);
		expect(address.city).toHaveLength(0);
		expect(address.street).toEqual('Kossuth tér');
		expect(address.housenumber).toEqual('1');
	});

	it('should return city and street when only these tags exist', () => {
		const address = PoiRelevantContent.parseAddress(createOsmElementWithTags({
			'addr:city': 'testCity',
			'addr:street': 'Kossuth tér',
			'addr:housenumber': '1',
		}));

		expect(address.displayable).toEqual(true);
		expect(address.city).toEqual('testCity');
		expect(address.street).toEqual('Kossuth tér');
		expect(address.housenumber).toEqual('1');
	});
});

it('parses phone tag', () => {
	const poiRelevantContent = PoiRelevantContent.createFromOsmElement(createOsmElementWithTags({
		phone: '+3630123456789',
	}));

	expect(poiRelevantContent.phone).toEqual('+3630123456789');
});

it('parses contact:phone tag', () => {
	const poiRelevantContent = PoiRelevantContent.createFromOsmElement(createOsmElementWithTags({
		'contact:phone': '+3630123456789',
	}));

	expect(poiRelevantContent.phone).toEqual('+3630123456789');
});

it('parses website tag', () => {
	const poiRelevantContent = PoiRelevantContent.createFromOsmElement(createOsmElementWithTags({
		website: 'https://google.com',
	}));

	expect(poiRelevantContent.website).toEqual('https://google.com');
});

it('parses contact:website tag', () => {
	const poiRelevantContent = PoiRelevantContent.createFromOsmElement(createOsmElementWithTags({
		'contact:website': 'https://google.com',
	}));

	expect(poiRelevantContent.website).toEqual('https://google.com');
});
