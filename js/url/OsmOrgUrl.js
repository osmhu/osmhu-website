import UrlHelper from './UrlHelper';

const createOsmDotOrgQueryString = (mapCenter, mapZoom) => {
	const lat = UrlHelper.roundToFiveDigits(mapCenter.lat);
	const lon = UrlHelper.roundToFiveDigits(mapCenter.lng);
	return '#map=' + mapZoom + '/' + lat + '/' + lon;
};

export default class OsmOrgUrl {
	static browseUrlFromOsmElementId(osmElementId) {
		return 'https://www.openstreetmap.org/' + osmElementId.type + '/' + osmElementId.id;
	}

	static editUrlFromOsmElementId(osmElementId) {
		return 'https://www.openstreetmap.org/edit?' + osmElementId.type + '=' + osmElementId.id;
	}

	static browseUrlFromMapCenterAndZoom(mapCenter, mapZoom) {
		return 'https://www.openstreetmap.org/' + createOsmDotOrgQueryString(mapCenter, mapZoom);
	}

	static editUrlFromMapCenterAndZoom(mapCenter, mapZoom) {
		return 'https://www.openstreetmap.org/edit' + createOsmDotOrgQueryString(mapCenter, mapZoom);
	}
}
