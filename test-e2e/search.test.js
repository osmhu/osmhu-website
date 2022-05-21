const Browser = require('./Browser.js');
const Search = require('./Search.js');

const serverUrl = 'http://osmhu.lan';

describe.each(['firefox', 'chrome'])('search (%s)', (browserName) => {
	let browser;
	let search;

	beforeAll(async () => {
		browser = new Browser(browserName);
		await browser.init();
		search = new Search(browser);
	});

	afterAll(async () => {
		await browser.cleanUp();
	});

	test('should show progress indicator after submit', async () => {
		await browser.get(serverUrl + '/');

		await search.fill('Budapest');

		let isSearchInProgress = await search.isSearchInProgress();
		expect(isSearchInProgress).toBe(false);

		await search.submit();

		isSearchInProgress = await search.isSearchInProgress();
		expect(isSearchInProgress).toBe(true);

		await browser.takeScreenshot('search-in-progress');
	});

	test.each([
		'Budapest',
		'Győr',
		'Kecskemét',
		'Budapest, A',
		'Győr, F',
		'Kecskemét, M',
		'Budapest, Széchenyi'
	])('should show autocomplete results after entering search term %s', async (autocompleteBeginning) => {
		await browser.get(serverUrl + '/');

		await search.fill(autocompleteBeginning);
		await search.waitForAutocompleteResults();

		await browser.takeScreenshot('search-autocomplete-' + autocompleteBeginning);
	});

	test.each([
		{ term: 'Budapest', expectedToContain: 'Budapest' },
		{ term: 'Győr', expectedToContain: 'Győr' },
		{ term: 'Pánd', expectedToContain: 'Pánd' },
		{ term: 'Sturovo', expectedToContain: 'Párkány' },
		{ term: 'London', expectedToContain: 'London' },
		{ term: 'Ostrom utca', expectedToContain: 'Ostrom utca' },
		{ term: 'Ostrom utca 6', expectedToContain: 'Ostrom utca 6' },
		{ term: 'Kossuth Lajos tér 1.', expectedToContain: 'Országház' },
		{ term: 'Március 15 utca', expectedToContain: 'Március 15. utca' },
		{ term: 'Március 15. utca', expectedToContain: 'Március 15. utca' },
		{ term: 'Balaton', expectedToContain: 'Balaton' },
		{ term: 'Déli pályaudvar', expectedToContain: 'Déli pályaudvar' },
		{ term: 'Keleti pályaudvar', expectedToContain: 'Keleti pályaudvar' },
		{ term: 'Népliget', expectedToContain: 'Népliget' },
		{ term: 'Seidl lépcső', expectedToContain: 'Seidl lépcső' },
		{ term: 'Árpád híd', expectedToContain: 'Árpád híd' },
		{ term: 'Erzsébet híd', expectedToContain: 'Erzsébet híd' },
		{ term: 'Kecskemét, Auchan', expectedToContain: 'Auchan' },
		{ term: 'Kecskemét, Homokbánya', expectedToContain: 'Homokbánya' },
		{ term: 'Kecskemét, Nagytemplom', expectedToContain: 'Nagytemplom' },
		{ term: 'Kecskemét, Városháza', expectedToContain: 'Városháza' },
		{ term: 'Viktória Fogadó', expectedToContain: 'Viktória Fogadó' },
	])
	('should display relevant result when searching for $term', async ({term, expectedToContain}) => {
		await browser.get(serverUrl + '/');

		await search.fill(term);
		await search.submit();
		await search.waitForResults();

		const firstResultTitle = await search.getFirstResultTitle();
		expect(firstResultTitle).toContain(expectedToContain);

		await search.selectFirstResult();

		await browser.takeScreenshot('search-results-' + term);
	});
});
