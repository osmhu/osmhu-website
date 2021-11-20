import log from 'loglevel';
import present from 'present';

import PopupHtmlCreatorWorker from './PopupHtmlCreator.worker'; // eslint-disable-line import/default

export default class PopupHtmlCreatorMulti {
	/* istanbul ignore next */
	static async create(osmElements) {
		return new Promise((resolve) => {
			const popupHtmlCreatorWorker = new PopupHtmlCreatorWorker(); // lgtm [js/call-to-non-callable]

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
}
