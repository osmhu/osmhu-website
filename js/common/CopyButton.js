/* istanbul ignore file */

const ClipboardJS = require('clipboard/dist/clipboard.min');

module.exports = class CopyButton {
	static copyTargetOnButtonClick(buttonHtmlElement, targetHtmlElement) {
		this.clipboard = new ClipboardJS(buttonHtmlElement, {
			target: () => targetHtmlElement,
		});
	}
};
