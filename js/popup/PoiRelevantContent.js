import log from 'loglevel';

import StringUtil from '../common/StringUtil';
import OsmOrgUrl from '../url/OsmOrgUrl';

import SignificantNames from './SignificantNames';

const parsePhone = (osmElement) => osmElement.tags?.phone || osmElement.tags?.['contact:phone'] || '';

const parseWebsite = (osmElement) => osmElement.tags?.website || osmElement.tags?.['contact:website'] || '';

const parseWheelchair = (osmElement) => {
	let wheelchair = '';

	if (!osmElement.tags) {
		wheelchair = 'unknown';
	} else {
		wheelchair = osmElement.tags.wheelchair;
		if (osmElement.tags.wheelchair !== undefined &&
				osmElement.tags.wheelchair !== 'yes' &&
				osmElement.tags.wheelchair !== 'limited' &&
				osmElement.tags.wheelchair !== 'no') {
			log.warn('Unknown wheelchair tag ' + osmElement.tags.wheelchair + '. ' +
				'Possible values are [yes, limited, no], osm element: ' + osmElement.id.toString());
			wheelchair = 'unknown';
		}
		if (osmElement.tags.wheelchair === undefined) {
			wheelchair = 'unknown';
		}
	}
	return wheelchair;
};

export default class PoiRelevantContent {
	constructor(osmElementId) {
		this.osmElementId = osmElementId;
	}

	static parseAddress(osmElement) {
		const city = osmElement.tags?.['addr:city'] || '';
		const street = osmElement.tags?.['addr:street'] || '';
		const housenumber = osmElement.tags?.['addr:housenumber'] || '';

		if (!city && !street) {
			log.info('Failed to parse address on ' + osmElement.id.toString() + ', ' + OsmOrgUrl.browseUrlFromOsmElementId(osmElement.id));
			return {
				displayable: false,
				city: '',
				street: '',
				housenumber: '',
			};
		}

		return {
			displayable: !!city || !!street || !!housenumber,
			city,
			street,
			housenumber: (!!street && !!housenumber) ? housenumber : '',
		};
	}

	static createFromOsmElement(osmElement) {
		const poiRelevantContent = new PoiRelevantContent(osmElement.id);
		const significantNames = SignificantNames.generateFromTags(osmElement.tags);
		poiRelevantContent.primaryName = StringUtil.upperCaseFirstLetter(significantNames.primaryName);
		if (significantNames.secondaryName) {
			poiRelevantContent.secondaryName = significantNames.secondaryName;
		}
		poiRelevantContent.address = PoiRelevantContent.parseAddress(osmElement);
		poiRelevantContent.phone = parsePhone(osmElement);
		poiRelevantContent.website = parseWebsite(osmElement);
		poiRelevantContent.opening_hours = osmElement.tags?.opening_hours;
		poiRelevantContent.wheelchair = parseWheelchair(osmElement);
		poiRelevantContent.osmOrgBrowseUrl = OsmOrgUrl.browseUrlFromOsmElementId(osmElement.id);
		poiRelevantContent.osmOrgEditUrl = OsmOrgUrl.editUrlFromOsmElementId(osmElement.id);

		return poiRelevantContent;
	}
}
