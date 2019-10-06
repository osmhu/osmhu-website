/* istanbul ignore file */
/* globals document */

const ClipboardJS = require('clipboard/dist/clipboard.min');

module.exports = class CopyButton {
	static copyTargetOnButtonClick(buttonSelector, targetSelector) {
		this.clipboard = new ClipboardJS(buttonSelector, {
			target: () => document.querySelector(targetSelector),
		});
	}
};
