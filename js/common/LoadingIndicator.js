/* istanbul ignore file */

export default class LoadingIndicator {
	static show() {
		document.body.classList.add('loading');
	}

	static hide() {
		document.body.classList.remove('loading');
	}

	static setVisible(visible) {
		if (visible) {
			this.show();
		} else {
			this.hide();
		}
	}
}
