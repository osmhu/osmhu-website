const log = require('loglevel');

let notificationCallback = () => {
	log.debug('url param change callback called, but no callback has been set');
};

module.exports = class UrlParamChangeNotifier {
	static trigger() {
		notificationCallback();
	}

	static setNotificationCallback(cb) {
		notificationCallback = cb;
	}
};
