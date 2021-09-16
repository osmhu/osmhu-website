import UrlParams from './UrlParams';

describe('parsing map parameters', () => {
	const testUrlMapParams = (locationQueryString, expectedZoom, expectedLat, expectedLon) => {
		const urlParams = new UrlParams(locationQueryString);

		expect(urlParams.lat).toEqual(expectedLat);
		expect(urlParams.lon).toEqual(expectedLon);
		expect(urlParams.zoom).toEqual(expectedZoom);
	};

	it('should return marker position if defined', () => {
		testUrlMapParams('?zoom=11&mlat=47.4983815&mlon=19.0404707', 11, 47.4983815, 19.0404707);
	});

	it('should return marker position if normal position is also defined', () => {
		testUrlMapParams('?zoom=11&mlat=47.4983815&mlon=19.0404707&lat=46.9080769&lon=19.6928133', 11, 47.4983815, 19.0404707);
	});

	it('should return position if defined', () => {
		testUrlMapParams('?zoom=11&lat=47.4983815&lon=19.0404707', 11, 47.4983815, 19.0404707);
	});

	it('should return default parameters for hungary if only partially defined', () => {
		testUrlMapParams('?zoom=11', 7, 47.17, 19.49);
		testUrlMapParams('?lat=47.4983815', 7, 47.17, 19.49);
		testUrlMapParams('?lon=19.0404707', 7, 47.17, 19.49);
	});

	it('should return default parameters for hungary if not set otherwise', () => {
		testUrlMapParams('', 7, 47.17, 19.49);
	});
});

it.each([
	{ queryString: '?', activeOverlays: [] },
	{ queryString: '?tur=1', activeOverlays: ['tur'] },
	{ queryString: '?okt=1', activeOverlays: ['okt'] },
	{ queryString: '?ddk=1', activeOverlays: ['ddk'] },
	{ queryString: '?akt=1', activeOverlays: ['akt'] },
	{ queryString: '?tur=1&okt=1', activeOverlays: ['tur', 'okt'] },
	{ queryString: '?tur=1&ddk=1', activeOverlays: ['tur', 'ddk'] },
	{ queryString: '?tur=1&okt=1&ddk=1', activeOverlays: ['tur', 'okt', 'ddk'] },
	{ queryString: '?tur=1&okt=1&ddk=1&akt=1', activeOverlays: ['tur', 'okt', 'ddk', 'akt'] },
])('should return active overlays', ({ queryString, activeOverlays }) => {
	const urlParams = new UrlParams(queryString);
	activeOverlays.forEach((overlayId) => {
		expect(urlParams.isOverlayActive(overlayId)).toBeTruthy();
	});
});

it.each([
	{ queryString: '?zoom=11&type=relation&id=1244004', type: 'relation', id: 1244004 },
	{ queryString: '?zoom=11&type=node&id=85788293', type: 'node', id: 85788293 },
	{ queryString: '?zoom=15&type=way&id=197110386', type: 'way', id: 197110386 },
])('should parse query string for osm element $type $id', ({ queryString, type, id }) => {
	const urlParams = new UrlParams(queryString);

	expect(urlParams.isOsmElementDefined()).toBeTruthy();
	expect(urlParams.osmElementId.type).toEqual(type);
	expect(urlParams.osmElementId.id).toEqual(id);
});

it.each([
	{ queryString: '?poi=restaurant', poiLayers: ['restaurant'] },
	{ queryString: '?poi=restaurant,fast_food', poiLayers: ['restaurant', 'fast_food'] },
	{ queryString: '?poi=bakery,florist,greengrocer', poiLayers: ['bakery', 'florist', 'greengrocer'] },
])('should parse query string for poi layers', ({ queryString, poiLayers }) => {
	const urlParams = new UrlParams(queryString);

	expect(urlParams.poiLayers).toEqual(poiLayers);
});
