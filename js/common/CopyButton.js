/* istanbul ignore file */

import Clipboard from 'clipboard';

export default class CopyButton {
	static copyTargetOnButtonClick(buttonHtmlElement, targetHtmlElement) {
		this.clipboard = new Clipboard(buttonHtmlElement, {
			target: () => targetHtmlElement,
		});
	}
}
