const UrlParamChangeNotifier = require('./UrlParamChangeNotifier');

it('should not throw if callback is not specified', () => {
	expect(() => {
		UrlParamChangeNotifier.trigger();
	}).not.toThrow();
});

it('should call the callback', () => {
	const notificationCallback = jest.fn();
	UrlParamChangeNotifier.setNotificationCallback(notificationCallback);

	UrlParamChangeNotifier.trigger();

	expect(notificationCallback).toHaveBeenCalledTimes(1);
});

it('should call the callback multiple times', () => {
	const notificationCallback = jest.fn();
	UrlParamChangeNotifier.setNotificationCallback(notificationCallback);

	UrlParamChangeNotifier.trigger();
	UrlParamChangeNotifier.trigger();
	UrlParamChangeNotifier.trigger();
	UrlParamChangeNotifier.trigger();

	expect(notificationCallback).toHaveBeenCalledTimes(4);
});
