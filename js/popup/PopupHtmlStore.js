export default class PopupHtmlStore {
	constructor() {
		this.store = {};
	}

	add(osmElementId, popupHtml) {
		const propertyName = osmElementId.toObjectPropertyName();
		this.store[propertyName] = popupHtml;
	}

	hasId(osmElementId) {
		const propertyName = osmElementId.toObjectPropertyName();
		return Object.keys(this.store).indexOf(propertyName) !== -1;
	}
}
