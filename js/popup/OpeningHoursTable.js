import { addDays, startOfWeek } from 'date-fns';
import OpeningHours from 'opening_hours';

// For opening_hours localization
const nominatimObjectForHungary = {
	class: 'boundary',
	type: 'administrative',
	osm_type: 'relation',
	place_id: '198645167',
	osm_id: '21335',
	address: {
		country: 'Magyarország',
		country_code: 'hu',
	},
};

function nonStopTable() {
	let table = '';
	table += '<table>';
	table += '<tr class="highlighted">';
	table += '<td class="day">Non-stop</td>';
	table += '<td>(Hétfő-vasárnap 0-24)</td>';
	table += '</tr>';
	table += '</table>';
	return table;
}

export default class OpeningHoursTable {
	/*
	 * Highligted ISO day of week: 1 - Monday, 7 - Sunday
	 * Reference: https://date-fns.org/docs/getISODay
	 */
	static generateTable(openingHoursString, highlightedIsoDayOfWeek) {
		let table = '';

		if (openingHoursString === '24/7') {
			return nonStopTable();
		}

		try {
			const days = 'Hétfő Kedd Szerda Csütörtök Péntek Szombat Vasárnap'.split(' ');

			const openingHours = new OpeningHours(openingHoursString, nominatimObjectForHungary);

			table += '<table>';
			let from = startOfWeek(new Date(), { weekStartsOn: 1 });

			for (let day = 0; day < 7; day++) {
				if (day === highlightedIsoDayOfWeek - 1) {
					table += '<tr class="highlighted">';
				} else {
					table += '<tr>';
				}
				table += `<td class="day">${days[day]}</td>`;

				const to = addDays(from, 1);
				const openingHoursOnCurrentDay = [];
				const intervals = openingHours.getOpenIntervals(from, to);
				Object.values(intervals).forEach((interval) => {
					const openFrom = new Date(interval[0]);
					const openTo = new Date(interval[1]);
					const fromHour = openFrom.getHours().toString().padStart(2, '0');
					const fromMinute = openFrom.getMinutes().toString().padStart(2, '0');
					let toHour = openTo.getHours().toString().padStart(2, '0');
					const toMinute = openTo.getMinutes().toString().padStart(2, '0');
					if (toHour === '00' && toMinute === '00') {
						toHour = '24';
					}
					const openInterval = `${fromHour}:${fromMinute} - ${toHour}:${toMinute}`;
					openingHoursOnCurrentDay.push(openInterval);
				});

				if (openingHoursOnCurrentDay.length > 0) {
					table += `<td>${openingHoursOnCurrentDay.join(', ')}</td>`;
				} else {
					table += '<td>zárva</td>';
				}
				from = to;
				table += '</tr>';
			}
			table += '</table>';

			return table;
		} catch (error) {
			throw new Error(`Unable to parse opening hours string '${openingHoursString}': ${error}`);
		}
	}
}
