const log = require('loglevel');

let notificationCallback = () => {
	log.debug('url param change notification callback called, but no callback has been set');
};

module.exports = class UrlParamChangeNotifier {
	static trigger() {
		notificationCallback();
	}

	static setNotificationCallback(cb) {
		if (typeof cb !== 'function') {
			log.error('url param change notification callback must be a function');
			return;
		}
		notificationCallback = cb;
	}
};
