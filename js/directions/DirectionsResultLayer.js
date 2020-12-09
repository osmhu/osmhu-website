const $ = require('jquery');
const L = require('leaflet');

const DirectionsNarrative = require('./DirectionsNarrative');

module.exports = class DirectionsResultLayer {
	constructor(targetMap, directionsApi) {
		this.targetMap = targetMap;

		this.directionsLayer = {};
		this.directionsApi = directionsApi;
	}

	async route(start, end, activeTransportType, avoidTollRoads) {
		const response = await this.directionsApi.route({
			start,
			end,
			options: {
				timeOverage: 25,
				unit: 'k',
				locale: 'hu_HU',
				routeType: activeTransportType,
				avoids: avoidTollRoads ? ['toll road'] : [],
			},
		});

		if (this.directionsLayer instanceof L.Layer) {
			this.directionsLayer.setDirectionsResponse(response);
		} else {
			this.directionsLayer = await this.directionsApi.directionsLayer({
				directionsResponse: response,
				startMarker: {
					title: 'Indulás helye',
					draggable: false,
					icon: 'marker-start',
					iconOptions: {
						size: 'sm',
					},
				},
				endMarker: {
					title: 'Érkezés helye',
					draggable: false,
					icon: 'marker-end',
					iconOptions: {
						size: 'sm',
					},
				},
				viaMarker: {
					title: 'Húzza el az útvonal módosításához',
				},
				routeRibbon: {
					opacity: 1,
				},
				alternateRouteRibbon: {
					opacity: 1,
				},
				paddingTopLeft: [450, 20],
				paddingBottomRight: [180, 20],
			});

			this.directionsLayer.addTo(this.targetMap);

			if (response.route) {
				this.displayRoute(response.route);
			}

			this.directionsLayer.on('directions_changed', (eventResponse) => {
				if (eventResponse.route) {
					this.displayRoute(eventResponse.route);
				}
			});
		}
	}

	displayRoute(route) {
		const directionsNarrative = new DirectionsNarrative($('#direction-results'));
		directionsNarrative.showRouteInfo(route);

		const { boundingBox } = route;
		const upperLeftCorner = L.latLng(boundingBox.ul.lat, boundingBox.ul.lng);
		const lowerRightCorner = L.latLng(boundingBox.lr.lat, boundingBox.lr.lng);
		let latLngBounds = L.latLngBounds(upperLeftCorner, lowerRightCorner);
		latLngBounds = latLngBounds.pad(0.1);
		this.targetMap.fitBounds(latLngBounds);
	}
};
