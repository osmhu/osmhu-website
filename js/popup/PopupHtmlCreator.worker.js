/* istanbul ignore file */
/* eslint-env worker */

const PopupHtmlCreatorSingle = require('./PopupHtmlCreatorSingle');

module.exports = (self) => {
	self.addEventListener('message', (event) => {
		const osmElements = event.data;
		const results = {};

		Object.values(osmElements).forEach((osmElement) => {
			const popupHtml = PopupHtmlCreatorSingle.create(osmElement);
			results[osmElement.id] = popupHtml;
		});

		self.postMessage(results);
	});
};
