const UrlParams = require('./UrlParams');

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

describe('parsing overlay parameters', () => {
	const expectOverlayState = (locationQueryString, expectedOverlaysToBeActive) => {
		const urlParams = new UrlParams(locationQueryString);
		expectedOverlaysToBeActive.forEach((overlayId) => {
			expect(urlParams.isOverlayActive(overlayId)).toBeTruthy();
		});
	};

	it('should return only active overlays', () => {
		expectOverlayState('?', []);
		expectOverlayState('?tur=1', ['tur']);
		expectOverlayState('?okt=1', ['okt']);
		expectOverlayState('?ddk=1', ['ddk']);
		expectOverlayState('?akt=1', ['akt']);
		expectOverlayState('?tur=1&okt=1', ['tur', 'okt']);
		expectOverlayState('?tur=1&ddk=1', ['tur', 'ddk']);
		expectOverlayState('?tur=1&okt=1&ddk=1', ['tur', 'okt', 'ddk']);
		expectOverlayState('?tur=1&okt=1&ddk=1&akt=1', ['tur', 'okt', 'ddk', 'akt']);
	});
});

describe('parsing osm object parameters', () => {
	const expectOsmObject = (locationQueryString, expectedOsmObjectType, expectedOsmObjectId) => {
		const urlParams = new UrlParams(locationQueryString);
		expect(urlParams.isOsmObjectDefined()).toBeTruthy();
		expect(urlParams.osmObjectType).toEqual(expectedOsmObjectType);
		expect(urlParams.osmObjectId).toEqual(expectedOsmObjectId);
	};

	it('should return osm object details', () => {
		expectOsmObject('?zoom=11&type=relation&id=1244004', 'relation', '1244004');
		expectOsmObject('?zoom=11&type=node&id=85788293', 'node', '85788293');
		expectOsmObject('?zoom=15&type=way&id=197110386', 'way', '197110386');
	});
});

describe('parsing poi layers parameters', () => {
	const expectPoiLayers = (locationQueryString, expectedPoiLayers) => {
		const urlParams = new UrlParams(locationQueryString);
		expect(urlParams.poiLayers).toEqual(expectedPoiLayers);
	};

	it('should return poi layers details', () => {
		expectPoiLayers('?poi=restaurant', ['restaurant']);
		expectPoiLayers('?poi=restaurant,fast_food', ['restaurant', 'fast_food']);
		expectPoiLayers('?poi=bakery,florist,greengrocer', ['bakery', 'florist', 'greengrocer']);
	});
});
