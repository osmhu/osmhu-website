import Marker from '../marker/Marker';
import MockedMap from '../map/test-helper/MockedMap';
import MockedShare from '../share/test-helper/MockedShare';

import Url from './Url';

jest.mock('../marker/Marker');
jest.mock('../popup/PopupHtmlCreator.worker.js');

describe('query string', () => {
	test.each([
		[5, 47.49843, 19.04115, '?zoom=5&lat=47.49843&lon=19.04115'],
		[8, 47.498432635, 19.0411512353, '?zoom=8&lat=47.49843&lon=19.04115'],
		[18, 0, 0, '?zoom=18&lat=0&lon=0'],
	])('should include map zoom and center',
		(zoom, lat, lng, expectedUrl) => {
			const mockedMap = MockedMap.build(zoom, lat, lng);
			const url = new Url(mockedMap, MockedShare.buildClosed());
			expect(url.createQueryString()).toEqual(expectedUrl);
		});

	test.each([
		[13, 47.49843, 19.04115, 'M', '?zoom=13&lat=47.49843&lon=19.04115'],
		[13, 47.49843, 19.04115, 'H', '?zoom=13&lat=47.49843&lon=19.04115&layer=H'],
	])('should include zoom, center coordinates and base layer when not default',
		(zoom, lat, lng, baseLayerId, expectedUrl) => {
			const mockedMap = MockedMap.build(zoom, lat, lng, baseLayerId);
			const url = new Url(mockedMap, MockedShare.buildClosed());
			expect(url.createQueryString()).toEqual(expectedUrl);
		});

	test.each([
		[13, 47.49843, 19.04115, 'M', ['tur'], '?zoom=13&lat=47.49843&lon=19.04115&tur=1'],
		[13, 47.49843, 19.04115, 'M', ['akt'], '?zoom=13&lat=47.49843&lon=19.04115&akt=1'],
		[13, 47.49843, 19.04115, 'M', ['ddk', 'okt'], '?zoom=13&lat=47.49843&lon=19.04115&ddk=1&okt=1'],
		[13, 47.49843, 19.04115, 'M', ['ddk', 'okt', 'akt'], '?zoom=13&lat=47.49843&lon=19.04115&ddk=1&okt=1&akt=1'],
	])('should include zoom, center coordinates and overlays if active',
		(zoom, lat, lng, baseLayerId, overlayIds, expectedUrl) => {
			const mockedMap = MockedMap.build(zoom, lat, lng, baseLayerId, overlayIds);
			const url = new Url(mockedMap, MockedShare.buildClosed());
			expect(url.createQueryString()).toEqual(expectedUrl);
		});

	test.each([
		[13, 47.49843, 19.04115, 'H', ['tur'], '?zoom=13&lat=47.49843&lon=19.04115&layer=H&tur=1'],
		[13, 47.49843, 19.04115, 'H', ['ddk', 'okt'], '?zoom=13&lat=47.49843&lon=19.04115&layer=H&ddk=1&okt=1'],
	])('should include zoom, center coordinates, base layer if changed and overlays if active',
		(zoom, lat, lng, baseLayerId, overlayIds, expectedUrl) => {
			const mockedMap = MockedMap.build(zoom, lat, lng, baseLayerId, overlayIds);
			const url = new Url(mockedMap, MockedShare.buildClosed());
			expect(url.createQueryString()).toEqual(expectedUrl);
		});

	test('should include zoom and shared poi coordinates if share is open', () => {
		const mockedMap = MockedMap.build(15, 0, 0);
		const url = new Url(mockedMap, MockedShare.buildOpenWithoutText(47.49843, 19.04115));
		expect(url.createQueryString()).toEqual('?zoom=15&mlat=47.49843&mlon=19.04115');
	});

	test('should include zoom, shared poi coordinates and encoded text if not empty', () => {
		const mockedMap = MockedMap.build(15, 0, 0);
		const openMockedShareWithText = MockedShare.buildOpenWithText(47.49843, 19.04115, 'Test text with <html>');
		const url = new Url(mockedMap, openMockedShareWithText);
		expect(url.createQueryString()).toEqual('?zoom=15&mlat=47.49843&mlon=19.04115&mtext=Test%20text%20with%20%3Chtml%3E');
	});

	test('should include zoom, shared poi coordinates and encoded text if not empty', () => {
		const mockedMap = MockedMap.build(15, 0, 0);
		const originalGetActivePoiPopupFn = Marker.getActivePoiPopup;
		Marker.getActivePoiPopup = jest.fn(() => ({
			type: 'relation',
			id: 1244004,
		}));

		const url = new Url(mockedMap, MockedShare.buildClosed());
		expect(url.createQueryString()).toEqual('?zoom=15&type=relation&id=1244004');
		Marker.getActivePoiPopup = originalGetActivePoiPopupFn;
	});
});
