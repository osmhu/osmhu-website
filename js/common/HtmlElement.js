/* istanbul ignore file */

export default class HtmlElement {
	static singleElementFromSelector(selector) {
		const results = document.querySelectorAll(selector);
		if (results.length === 0) {
			throw new Error(`Html element not found for selector: '${selector}'`);
		}
		if (results.length > 1) {
			const error = new Error(`Multiple (${results.length}) Html elements found for selector which must have single result: '${selector}'`);
			error.name = 'MultipleElementsFoundError';
			throw error;
		}
		const [htmlElement] = results;

		return htmlElement;
	}

	static async singleElementFromSelectorWithRetry(selector) {
		try {
			return HtmlElement.singleElementFromSelector(selector);
		} catch (error) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return HtmlElement.singleElementFromSelectorWithRetry(selector);
		}
	}
}
