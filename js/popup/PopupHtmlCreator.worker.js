/* istanbul ignore file */
/* eslint-env worker */

import 'core-js/features/object/values'; // IE 11 polyfill

import PopupHtmlCreatorSingle from './PopupHtmlCreatorSingle';

onmessage = (event) => {
	const osmElements = event.data;
	const results = {};

	Object.values(osmElements).forEach((osmElement) => {
		const popupHtml = PopupHtmlCreatorSingle.create(osmElement);
		results[osmElement.id] = popupHtml;
	});

	postMessage(results);
};
