import BaseLayers from '../map/BaseLayers';

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
		testUrlMapParams('?zoom=11&mlat=47.4983815&mlon=19.0404707&lat=46.9080769&lon=19.6928133',
			11, 47.4983815, 19.0404707);
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
	{ queryString: '?layer=M', expectedActiveBaseLayer: BaseLayers.ids.mapnik },
	{ queryString: '?layer=C', expectedActiveBaseLayer: BaseLayers.ids.cycle },
	{ queryString: '?layer=F', expectedActiveBaseLayer: BaseLayers.ids.osmfr },
	{ queryString: '?layer=T', expectedActiveBaseLayer: BaseLayers.ids.transport },
	{ queryString: '?layer=H', expectedActiveBaseLayer: BaseLayers.ids.humanitarian },
])('should return active base layer', ({ queryString, expectedActiveBaseLayer }) => {
	const urlParams = new UrlParams(queryString);
	expect(urlParams.layer).toEqual(expectedActiveBaseLayer);
});

it.each([
	{ queryString: '?', expectedActiveOverlays: [] },
	{ queryString: '?tur=1', expectedActiveOverlays: ['tur'] },
	{ queryString: '?okt=1', expectedActiveOverlays: ['okt'] },
	{ queryString: '?ddk=1', expectedActiveOverlays: ['ddk'] },
	{ queryString: '?akt=1', expectedActiveOverlays: ['akt'] },
	{ queryString: '?tur=1&okt=1', expectedActiveOverlays: ['tur', 'okt'] },
	{ queryString: '?tur=1&ddk=1', expectedActiveOverlays: ['tur', 'ddk'] },
	{ queryString: '?tur=1&okt=1&ddk=1', expectedActiveOverlays: ['tur', 'okt', 'ddk'] },
	{ queryString: '?tur=1&okt=1&ddk=1&akt=1', expectedActiveOverlays: ['tur', 'okt', 'ddk', 'akt'] },
])('should return active overlays', ({ queryString, expectedActiveOverlays }) => {
	const urlParams = new UrlParams(queryString);
	expectedActiveOverlays.forEach((overlayId) => {
		expect(urlParams.isOverlayActive(overlayId)).toBeTruthy();
	});
});

it.each([
	{ queryString: '?zoom=11&type=relation&id=1244004', expectedType: 'relation', expectedId: 1244004 },
	{ queryString: '?zoom=11&type=node&id=85788293', expectedType: 'node', expectedId: 85788293 },
	{ queryString: '?zoom=15&type=way&id=197110386', expectedType: 'way', expectedId: 197110386 },
])('should parse query string for osm element $type $id', ({ queryString, expectedType, expectedId }) => {
	const urlParams = new UrlParams(queryString);

	expect(urlParams.isOsmElementDefined()).toBeTruthy();
	expect(urlParams.osmElementId.type).toEqual(expectedType);
	expect(urlParams.osmElementId.id).toEqual(expectedId);
});

it.each([
	{ queryString: '?poi=restaurant', expectedPoiLayers: ['restaurant'] },
	{ queryString: '?poi=restaurant,fast_food', expectedPoiLayers: ['restaurant', 'fast_food'] },
	{ queryString: '?poi=bakery,florist,greengrocer', expectedPoiLayers: ['bakery', 'florist', 'greengrocer'] },
])('should parse query string for poi layers', ({ queryString, expectedPoiLayers }) => {
	const urlParams = new UrlParams(queryString);

	expect(urlParams.poiLayers).toEqual(expectedPoiLayers);
});
