const HtmlElement = require('../common/HtmlElement');

module.exports = class SearchField {
	constructor(fieldSelector) {
		this.field = HtmlElement.singleElementFromSelector(fieldSelector);
	}

	focus() {
		this.field.focus();
	}

	get value() {
		return this.field.value;
	}

	enableSearchingState() {
		this.field.classList.add('searching');
	}

	disableSearchingState() {
		this.field.classList.remove('searching');
	}
};
