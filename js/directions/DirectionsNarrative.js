export default class DirectionsNarrative {
	constructor(narrativeContainer) {
		this.$container = narrativeContainer;
	}

	showRouteInfo(route, info) {
		if (!route.legs) return;

		let html = '';

		if (info && info.statuscode !== 0) {
			html += `<div class="route-error">
						<img src="/kepek/1391811435_Warning.png" alt="Figyelem" width="32" height="32"
							class="route-error-warning-sign" />
						<p class="text-danger font-weight-bold">Az útvonaltervezés során hiba történt.</p>
					</div>`;
		}

		html += '<p class="total-time">Útidő: <span class="time">';
		html += route.formattedTime;
		html += '</span></p>';
		html += '<p class="total-length">Útvonal: <span class="length">';
		const distance = Math.round(parseFloat(route.distance) * 10) / 10;
		html += distance;
		html += '</span> km</p>';

		const { legs } = route;

		let i = 0;
		let j = 0;
		html += '<table>';
		for (; i < legs.length; i++) {
			for (j = 0; j < legs[i].maneuvers.length; j++) {
				const maneuver = legs[i].maneuvers[j];
				if (maneuver) {
					const focusCoordinate = maneuver.startPoint;
					html += `<tr onclick="window.osmhu.map.setView([${focusCoordinate.lat}, ${focusCoordinate.lng}],14);">`;
					if (maneuver.iconUrl) {
						maneuver.iconUrl = maneuver.iconUrl.replace(/^http:\/\//i, 'https://');
						html += `<td><img src="${maneuver.iconUrl}"></td>`;
					}
					if (maneuver.narrative) {
						html += `<td class="narrative">${maneuver.narrative}</td>`;
					}
					if (maneuver.distance) {
						const maneuverDistance = Math.round(parseFloat(maneuver.distance) * 10) / 10;
						html += `<td class="distance">${maneuverDistance}&nbsp;km</td>`;
					} else {
						html += '<td></td>';
					}
					html += '</tr>';
				}
			}
		}
		html += '</table>';

		html += '<p class="copyright">Az útvonaltervezés a ';
		html += '<a href="https://www.mapquest.com/" target="_blank">MapQuest</a>';
		html += ' használatával történt. Köszönjük!</p>';

		this.$container.find('.results').html(html);

		this.$container.find('.no-results').hide();
		this.$container.find('.results').show();
		this.$container.show();
	}
}
