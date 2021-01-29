/* istanbul ignore file */

export default class LoadingIndicator {
	static setLoading(isLoading) {
		if (isLoading) {
			document.body.classList.add('loading');
		} else {
			document.body.classList.remove('loading');
		}
	}
}
