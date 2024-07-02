import browserUpdate from 'browser-update';

export default class OldBrowserNotifier {
	static init() {
		browserUpdate({
			required: {
				i: 11, // Required IE version
			},
			l: 'hu', // Language
		});
	}
}
