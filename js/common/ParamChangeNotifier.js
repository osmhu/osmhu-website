import log from 'loglevel';

let notificationCallback = () => {
	log.debug('Param change notification callback called, but no callback has been set');
};

export default class ParamChangeNotifier {
	static trigger() {
		notificationCallback();
	}

	static setNotificationCallback(cb) {
		if (typeof cb !== 'function') {
			log.error('Param change notification callback must be a function');
			return;
		}
		notificationCallback = cb;
	}
}
