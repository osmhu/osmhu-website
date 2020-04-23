/* istanbul ignore file */
const log = require('loglevel');
const present = require('present');

const webworkify = require('webworkify');

module.exports = class PopupHtmlCreatorAsync {
	static create(overpassResults, cb) {
		// Require here instead of globally because testing would not work otherwise
		// (webworkify function returns error in test environment)
		const PopupCreatorWorker = webworkify(require('./PopupHtmlCreatorWorker.js')); // eslint-disable-line global-require

		const start = present();

		PopupCreatorWorker.addEventListener('message', (event) => {
			const results = event.data;

			const end = present();
			const elapsedMilliseconds = Math.round(end - start);
			const itemCount = overpassResults.length;
			log.debug('Generated poi popup html for ' + itemCount + ' items in ' + elapsedMilliseconds + 'ms');

			cb(Object.entries(results));
		});

		PopupCreatorWorker.postMessage(overpassResults);
	}
};
