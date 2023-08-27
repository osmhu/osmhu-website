import { getISODay } from 'date-fns';
import log from 'loglevel';

import OsmOrgUrl from '../url/OsmOrgUrl';

import OpeningHoursTable from './OpeningHoursTable';
import WebsiteUrl from './WebsiteUrl';
import Wheelchair from './Wheelchair';

export default class PopupHtmlCreatorSingle {
	static address(address) {
		if (address.displayable !== true) {
			return '';
		}

		let displayedAddress = '';
		if (address.city) {
			displayedAddress += address.city;
		}
		if (address.city && address.street) {
			displayedAddress += ', ';
		}
		if (address.street) {
			displayedAddress += address.street;
		}
		if (address.street && address.housenumber) {
			displayedAddress += ' ' + address.housenumber;
		}
		const housenumberLastCharacterIsNumber = /.*\d$/.test(address.housenumber);
		if (address.street && address.housenumber && housenumberLastCharacterIsNumber) {
			displayedAddress += '.';
		}
		return displayedAddress;
	}

	static create(poiRelevantContent) {
		const shareUrl = true;

		let html = `<div id="popup-content-${poiRelevantContent.osmElementId.toObjectPropertyName()}" class="popup-content">`;

		html += Wheelchair.createLogo(poiRelevantContent);

		html += '<h1 class="title">' + poiRelevantContent.primaryName + '</h1>';
		if (poiRelevantContent.secondaryName && poiRelevantContent.secondaryName.length > 0) {
			html += '<p class="type">' + poiRelevantContent.secondaryName + '</p>';
		}
		if (poiRelevantContent.address && poiRelevantContent.address.displayable) {
			html += '<p class="addr">' + this.address(poiRelevantContent.address) + '</p>';
		}
		html += '<div class="details">';
		if (poiRelevantContent.phone && poiRelevantContent.phone.length > 0) {
			html += '<p class="phone">Telefon: <i>' + poiRelevantContent.phone + '</i></p>';
		}
		if (poiRelevantContent.website && poiRelevantContent.website.length > 0) {
			html += '<p class="website">';
			html += '<span class="website-label">Weboldal:&nbsp;</span>';
			html += WebsiteUrl.shrink(poiRelevantContent.website, 34);
			html += '</p>';
		}
		html += '</div>';
		const { openingHours } = poiRelevantContent;
		if (openingHours) {
			const isoDayOfWeekForToday = getISODay(new Date());
			try {
				const openingHoursTable = OpeningHoursTable.generateTable(openingHours, isoDayOfWeekForToday);
				if (openingHoursTable) {
					html += '<div class="opening-hours">';
					html += '<p>Nyitvatartás:</p>';
					html += openingHoursTable;
					html += '</div>';
				}
			} catch (error) {
				const osmOrgUrl = OsmOrgUrl.browseUrlFromOsmElementId(poiRelevantContent.osmElementId);
				log.info('Failed to parse opening_hours tag on', poiRelevantContent.osmElementId.toString(), osmOrgUrl, error);
			}
		}
		html += '<div class="options">';
		if (shareUrl) {
			html += '<span class="mobile-hidden">';
			const onClick = "this.parentElement.parentElement.querySelector('.share').style.display = 'block'; " +
				"this.parentElement.parentElement.querySelector('.share .share-url').select()";
			html += '<button onclick="' + onClick + '">Megosztás</button>';
			html += '</span>';
		}
		html += '<button onclick="window.open(\'' + poiRelevantContent.osmOrgBrowseUrl + '\')">Minden adat</button>';
		html += '<button onclick="window.open(\'' + poiRelevantContent.osmOrgEditUrl + '\')">Szerkesztés</button>';
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
}
