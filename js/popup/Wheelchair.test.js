const Wheelchair = require('./Wheelchair');

it('renders nothing if wheelchair tag does not exist', () => {
	const html = Wheelchair.createLogo('1', 'node', {});

	expect(html).toEqual('');
});

it('renders correctly for accessible node', () => {
	const html = Wheelchair.createLogo('1', 'node', {
		wheelchair: 'yes',
	});

	expect(html).toMatchSnapshot();
});

it('renders correctly for accessible way', () => {
	const html = Wheelchair.createLogo('2', 'way', {
		wheelchair: 'yes',
	});

	expect(html).toMatchSnapshot();
});

it('renders correctly for accessible relation', () => {
	const html = Wheelchair.createLogo('3', 'relation', {
		wheelchair: 'yes',
	});

	expect(html).toMatchSnapshot();
});

it('renders correctly for limited node', () => {
	const html = Wheelchair.createLogo('1', 'node', {
		wheelchair: 'limited',
	});

	expect(html).toMatchSnapshot();
});

it('renders correctly for limited way', () => {
	const html = Wheelchair.createLogo('2', 'way', {
		wheelchair: 'limited',
	});

	expect(html).toMatchSnapshot();
});

it('renders correctly for limited relation', () => {
	const html = Wheelchair.createLogo('3', 'relation', {
		wheelchair: 'limited',
	});

	expect(html).toMatchSnapshot();
});

it('renders correctly for inaccessible node', () => {
	const html = Wheelchair.createLogo('1', 'node', {
		wheelchair: 'no',
	});

	expect(html).toMatchSnapshot();
});

it('renders correctly for inaccessible way', () => {
	const html = Wheelchair.createLogo('2', 'way', {
		wheelchair: 'no',
	});

	expect(html).toMatchSnapshot();
});

it('renders correctly for inaccessible relation', () => {
	const html = Wheelchair.createLogo('3', 'relation', {
		wheelchair: 'no',
	});

	expect(html).toMatchSnapshot();
});
