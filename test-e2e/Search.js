module.exports = class Search {
	constructor(browser) {
		this.browser = browser;
	}

	async getSearchField() {
		return this.browser.findElementById('text-search');
	}

	async fill(text) {
		const searchField = await this.getSearchField();
		await searchField.sendKeys(text);
	}

	async submit() {
		const searchButton = await this.browser.findElementByClass('search-button');
		await searchButton.click();
	}

	async waitForAutocompleteResults() {
		await this.browser.findElementById('algolia-autocomplete-listbox-0');
	}

	async waitForResults() {
		await this.browser.findElementByClass('search-results');
	}

	async isSearchInProgress() {
		const searchField = await this.getSearchField();
		const classesString = await searchField.getAttribute('class');
		const classes = classesString.split(" ");
		return classes.includes('searching');
	}

	async getAutocompleteResultsList() {
		const resultsXpath = '//div[@id="algolia-autocomplete-listbox-0"]//div[@class="aa-dataset-1"]//a';
		return await this.browser.findElementsByXPath(resultsXpath);
	}

	async getFirstResultTitle() {
		const firstResultXpath = '//div[contains(@class, "search-results")]//div[@class="results"]//div[@class="search-result"][1]//a';
		const firstResult = await this.browser.findElementByXPath(firstResultXpath);
		return await firstResult.getText();
	}

	async selectFirstResult() {
		const firstResultXpath = '//div[contains(@class, "search-results")]//div[@class="results"]//div[@class="search-result"][1]//a';
		const firstResult = await this.browser.findElementByXPath(firstResultXpath);
		await firstResult.click();

		await this.browser.findElementByClass('popup-content');
		return await new Promise(resolve => setTimeout(resolve, 500));
	}
}
