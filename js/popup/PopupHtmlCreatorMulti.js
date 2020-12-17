const log = require('loglevel');
const present = require('present');
const webworkify = require('webworkify');

module.exports = class PopupHtmlCreatorMulti {
	/* istanbul ignore next */
	static async create(osmElements) {
		return new Promise((resolve) => {
			// Require here instead of globally because testing would not work otherwise
			// (webworkify function returns error in test environment)
			const popupHtmlCreatorWorker = webworkify(require('./PopupHtmlCreator.worker.js')); // eslint-disable-line global-require

			const start = present();

			popupHtmlCreatorWorker.addEventListener('message', (event) => {
				const results = event.data;

				const end = present();
				const elapsedMilliseconds = Math.round(end - start);
				const itemCount = osmElements.length;
				log.debug('Generated poi popup html for ' + itemCount + ' items in ' + elapsedMilliseconds + 'ms');

				resolve(Object.entries(results));
			});

			popupHtmlCreatorWorker.postMessage(osmElements);
		});
	}
};
