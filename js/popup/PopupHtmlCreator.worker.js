/* istanbul ignore file */
/* eslint-env worker */

const PopupHtmlCreator = require('./PopupHtmlCreator');

module.exports = (self) => {
	self.addEventListener('message', (event) => {
		const overpassResults = event.data;
		const results = {};

		Object.values(overpassResults).forEach((overpassResult) => {
			const popupHtml = PopupHtmlCreator.generateHtml(overpassResult);
			results[overpassResult.id] = popupHtml;
		});

		self.postMessage(results);
	});
};
