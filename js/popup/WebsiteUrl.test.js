const WebsiteUrl = require('./WebsiteUrl');

it('renders correctly for short url without protocol', () => {
	const html = WebsiteUrl.shrink('openstreetmap.hu', 34);
	expect(html).toMatchSnapshot();
});

it('renders correctly for short url with http protocol without www', () => {
	const html = WebsiteUrl.shrink('http://openstreetmap.hu', 34);
	expect(html).toMatchSnapshot();
});

it('renders correctly for short url with https protocol without www', () => {
	const html = WebsiteUrl.shrink('http://openstreetmap.hu', 34);
	expect(html).toMatchSnapshot();
});

it('renders correctly for short url with http protocol with www', () => {
	const html = WebsiteUrl.shrink('http://www.openstreetmap.hu', 34);
	expect(html).toMatchSnapshot();
});

it('renders correctly for short url with https protocol with www', () => {
	const html = WebsiteUrl.shrink('https://www.openstreetmap.hu', 34);
	expect(html).toMatchSnapshot();
});

it('renders correctly for short url with https protocol with www ending with /', () => {
	const html = WebsiteUrl.shrink('https://www.openstreetmap.hu/', 34);
	expect(html).toMatchSnapshot();
});

it('renders correctly for long url without protocol', () => {
	const html = WebsiteUrl.shrink('openstreetmap.hu', 10);
	expect(html).toMatchSnapshot();
});

it('renders correctly for long url without protocol ending with /', () => {
	const html = WebsiteUrl.shrink('openstreetmap.hu/', 10);
	expect(html).toMatchSnapshot();
});

it('renders correctly for long url with http protocol without www', () => {
	const html = WebsiteUrl.shrink('http://openstreetmap.hu', 10);
	expect(html).toMatchSnapshot();
});

it('renders correctly for long url with https protocol without www', () => {
	const html = WebsiteUrl.shrink('https://openstreetmap.hu', 10);
	expect(html).toMatchSnapshot();
});

it('renders correctly for long url with https protocol without www ending with /', () => {
	const html = WebsiteUrl.shrink('https://openstreetmap.hu/', 10);
	expect(html).toMatchSnapshot();
});

it('renders correctly for long url with http protocol with www', () => {
	const html = WebsiteUrl.shrink('http://www.openstreetmap.hu', 10);
	expect(html).toMatchSnapshot();
});

it('renders correctly for long url with https protocol with www', () => {
	const html = WebsiteUrl.shrink('https://www.openstreetmap.hu', 10);
	expect(html).toMatchSnapshot();
});
