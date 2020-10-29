/* istanbul ignore file */
/* globals document */

module.exports = class HtmlElement {
	static singleElementFromSelector(selector) {
		const results = document.querySelectorAll(selector);
		if (results.length === 0) {
			throw new Error('Html element not found for selector: `' + selector + '`');
		}
		if (results.length > 1) {
			throw new Error('Multiple Html elements found for selector which must have single result: `' + selector + '`. Found elements: ', results);
		}
		const [htmlElement] = results;

		return htmlElement;
	}
};
