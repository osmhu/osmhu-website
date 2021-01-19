/* istanbul ignore file */

export default class SearchResult {
	constructor(type, id, icon, primaryName, surroundingArea) {
		this.type = type;
		this.id = id;
		this.icon = icon;
		this.primaryName = primaryName;
		this.surroundingArea = surroundingArea;
	}
}
