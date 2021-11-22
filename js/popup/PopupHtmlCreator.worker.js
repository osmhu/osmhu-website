/* istanbul ignore file */
/* eslint-env worker */

import 'core-js/features/object/values'; // IE 11 polyfill
import 'core-js/features/promise'; // IE 11 polyfill

import OsmElement from '../common/OsmElement';

import PoiRelevantContent from './PoiRelevantContent';
import PopupHtmlCreatorSingle from './PopupHtmlCreatorSingle';

onmessage = (event) => {
	const osmElementsData = event.data;
	const results = {};

	Object.values(osmElementsData).forEach((osmElementData) => {
		const osmElement = OsmElement.fromRawObject(osmElementData);
		const poiRelevantContent = PoiRelevantContent.createFromOsmElement(osmElement);
		const popupHtml = PopupHtmlCreatorSingle.create(poiRelevantContent);
		results[osmElement.id.toObjectPropertyName()] = popupHtml;
	});

	postMessage(results);
};
