import { getISODay } from 'date-fns';
import log from 'loglevel';

import StringUtil from '../common/StringUtil';

import NiceDisplay from './NiceDisplay';
import OpeningHoursTable from './OpeningHoursTable';
import WebsiteUrl from './WebsiteUrl';
import Wheelchair from './Wheelchair';

export default class PopupHtmlCreatorSingle {
	static create(element) {
		const shareUrl = true;

		let html = `<div id="popup-content-${element.type}-${element.id}" class="popup-content">`;

		html += Wheelchair.createLogo(element.id, element.type, element.tags);

		const names = NiceDisplay.names(element.tags);
		html += '<h1 class="title">' + StringUtil.upperCaseFirstLetter(names.primaryName) + '</h1>';
		if (names.secondaryName) {
			html += '<p class="type">' + names.secondaryName + '</p>';
		}

		try {
			const address = NiceDisplay.address(element.tags);
			html += '<p class="addr">' + address + '</p>';
		} catch (error) {
			if (error.message !== 'Necessary tags missing') {
				log.error('Failed to parse address on', element.type, element.id, error);
			}
		}

		html += '<div class="details">';
		const phone = element.tags.phone || element.tags['contact:phone'];
		if (phone) {
			html += '<p class="phone">Telefon: <i>' + phone + '</i></p>';
		}
		const website = element.tags.website || element.tags['contact:website'];
		if (website) {
			html += '<p class="website">';
			html += '<span class="website-label">Weboldal:&nbsp;</span>';
			html += WebsiteUrl.shrink(website, 34);
			html += '</p>';
		}
		html += '</div>';
		const openingHours = element.tags.opening_hours;
		if (openingHours) {
			const isoDayOfWeekForToday = getISODay(new Date());
			try {
				const openingHoursTable = OpeningHoursTable.generateTable(openingHours, isoDayOfWeekForToday);
				if (openingHoursTable) {
					html += '<div class="opening_hours">';
					html += '<p>Nyitvatartás:</p>';
					html += openingHoursTable;
					html += '</div>';
				}
			} catch (error) {
				log.info('Failed to parse opening_hours tag on', element.type, element.id, 'https://openstreetmap.org/' + element.type + '/' + element.id, error);
			}
		}
		html += '<div class="options">';
		if (shareUrl) {
			html += '<span class="mobile-hidden">';
			// eslint-disable-next-line quotes
			const onClick = `this.parentElement.parentElement.querySelector('.share').style.display = 'block'; this.parentElement.parentElement.querySelector('.share .share-url').select()`;
			html += '<button onclick="' + onClick + '">Megosztás</button>';
			html += '</span>';
		}
		const browseUrl = PopupHtmlCreatorSingle.osmBrowseUrl(element);
		html += '<button onclick="window.open(\'' + browseUrl + '\')">Minden adat</button>';
		const editUrl = PopupHtmlCreatorSingle.osmEditUrl(element);
		html += '<button onclick="window.open(\'' + editUrl + '\')">Szerkesztés</button>';
		if (shareUrl) {
			html += '<div class="share">';
			html += '<p>Megosztáshoz használd az alábbi hivatkozást:</p>';
			html += '<p><input type="text" id="popup-poi-share-url" class="share-url" onclick="this.select()" readonly="readonly" ></p>';
			html += '<p><button id="popup-poi-copy" type="button">Másolás</button></p>';
			html += '</div>';
		}
		html += '</div>';
		html += '</div>';
		return html;
	}

	static osmBrowseUrl(element) {
		return `https://www.openstreetmap.org/browse/${element.type}/${element.id}`;
	}

	static osmEditUrl(element) {
		return `https://www.openstreetmap.org/edit?${element.type}=${element.id}`;
	}
}
