const popup = require('../popup');

module.exports = (self) => {
	self.addEventListener('message', (event) => {
		const overpassResults = event.data;
		const results = {};

		Object.values(overpassResults).forEach((overpassResult) => {
			const popupHtml = popup.generateHtml(overpassResult);
			results[overpassResult.id] = popupHtml;
		});

		self.postMessage(results);
	});
};
