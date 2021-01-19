import HtmlElement from '../common/HtmlElement';

export default class SearchField {
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
}
