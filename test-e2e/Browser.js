const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const ie = require('selenium-webdriver/ie');
const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs/promises');

const screen = {
	width: 1536,
	height: 864
};

module.exports = class Browser {
	constructor(browserName) {
		this.browserName = browserName;
		this.timeout = 20 * 1000;
	}

	async init() {
		this.browser = await new Builder()
			.forBrowser(this.browserName)
			.setIeOptions(new ie.Options())
			.setChromeOptions(new chrome.Options().headless().windowSize(screen))
			.setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
			.build();

		await fs.mkdir(`${reportDirectory}/${this.browserName}-screenshots/`, { recursive: true });
	}

	async cleanUp() {
		await this.browser.quit();
	}

	async findElementById(id) {
		const element = await this.browser.wait(until.elementLocated(By.id(id)), this.timeout);
		await this.browser.wait(until.elementIsVisible(element), this.timeout);
		return this.browser.findElement(By.id(id));
	}

	async findElementByClass(cssClass) {
		const element = await this.browser.wait(until.elementLocated(By.className(cssClass)), this.timeout);
		await this.browser.wait(until.elementIsVisible(element), this.timeout);
		return this.browser.findElement(By.className(cssClass));
	}

	async findElementByXPath(xpath) {
		const element = await this.browser.wait(until.elementLocated(By.xpath(xpath)), this.timeout);
		await this.browser.wait(until.elementIsVisible(element), this.timeout);
		return this.browser.findElement(By.xpath(xpath));
	}

	async findElementsByXPath(xpath) {
		const element = await this.browser.wait(until.elementLocated(By.xpath(xpath)), this.timeout);
		await this.browser.wait(until.elementIsVisible(element), this.timeout);
		return this.browser.findElements(By.xpath(xpath));
	}

	async get(url) {
		return await this.browser.get(url);
	}

	async takeScreenshot(name) {
		const screenshot = await this.browser.takeScreenshot();
		const filename = `${reportDirectory}/${this.browserName}-screenshots/${name}.png`;
		const screenshotData = screenshot.replace(/^data:image\/png;base64,/, '');
		await fs.writeFile(filename, screenshotData, 'base64');
	}
}
