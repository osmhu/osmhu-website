import queryString from 'query-string';

import OsmElementId from '../common/OsmElementId';

const defaultCenterAndZoomForHungary = {
	lat: 47.17,
	lon: 19.49,
	zoom: 7,
};

const floatParam = (value) => Number.parseFloat(value);
const intParam = (value) => Number.parseInt(value, 10);

export default class UrlParams {
	constructor(locationSearchQuery) {
		this.params = queryString.parse(locationSearchQuery);

		this.parseMapParameters();
		this.parseOverlayParameters();
		this.parseOsmElementParameters();
		this.parsePoiParameters();
	}

	parseMapParameters() {
		// Backwards compatibility with old mzoom url's
		this.zoom = intParam(this.params.zoom) || intParam(this.params.mzoom);

		const positionDefinedInUrl = this.params.zoom && this.params.lat && this.params.lon;

		if (this.isMarkerDefined()) {
			this.lat = floatParam(this.params.mlat);
			this.lon = floatParam(this.params.mlon);
			this.zoom = intParam(this.params.zoom);
			this.markerText = this.params.mtext;
		} else if (positionDefinedInUrl) {
			this.lat = floatParam(this.params.lat);
			this.lon = floatParam(this.params.lon);
			this.zoom = intParam(this.params.zoom);
		} else {
			this.lat = defaultCenterAndZoomForHungary.lat;
			this.lon = defaultCenterAndZoomForHungary.lon;
			this.zoom = defaultCenterAndZoomForHungary.zoom;
		}
	}

	parseOverlayParameters() {
		this.activeOverlays = [];

		const possibleOverlays = ['tur', 'okt', 'ddk', 'akt'];
		possibleOverlays.forEach((overlayId) => {
			if (this.params[overlayId] === '1') {
				this.activeOverlays.push(overlayId);
			}
		});
	}

	parseOsmElementParameters() {
		if (this.isOsmElementDefined()) {
			this.osmElementId = new OsmElementId(this.params.type, this.params.id);
		}
	}

	parsePoiParameters() {
		if (this.isPoiLayersDefined()) {
			this.poiLayers = this.params.poi.split(',');
		}
	}

	isMarkerDefined() {
		return this.params.zoom && this.params.mlat && this.params.mlon;
	}

	isOverlayActive(overlayId) {
		return this.activeOverlays.indexOf(overlayId) !== -1;
	}

	isOsmElementDefined() {
		return this.params.type && this.params.id;
	}

	isPoiLayersDefined() {
		return this.params.poi;
	}
}
