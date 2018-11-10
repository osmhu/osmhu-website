const OpeningHoursTable = require('./OpeningHoursTable');

it('ensures leading zeros for values', () => {
	expect(OpeningHoursTable.ensureLeadingZero('0')).toEqual('00');
	expect(OpeningHoursTable.ensureLeadingZero('1')).toEqual('01');
	expect(OpeningHoursTable.ensureLeadingZero('9')).toEqual('09');
	expect(OpeningHoursTable.ensureLeadingZero('10')).toEqual('10');
	expect(OpeningHoursTable.ensureLeadingZero('60')).toEqual('60');
});

it('renders correctly for non-stop poi', () => {
	const table = OpeningHoursTable.generateTable('24/7', 1);
	expect(table).toMatchSnapshot();
});

it('renders correctly for Mo-Su 10:00-19:00', () => {
	const table = OpeningHoursTable.generateTable('Mo-Su 10:00-19:00', 1);
	expect(table).toMatchSnapshot();
});

it('renders correctly for Mo-Sa 07:00-21:00; Su 08:00-18:00', () => {
	const table = OpeningHoursTable.generateTable('Mo-Sa 07:00-21:00; Su 08:00-18:00', 1);
	expect(table).toMatchSnapshot();
});

it('renders correctly for Mo-Fr 09:00-12:00,13:00-17:00; Sa 08:00-12:00', () => {
	const table = OpeningHoursTable.generateTable('Mo-Fr 09:00-12:00,13:00-17:00; Sa 08:00-12:00', 1);
	expect(table).toMatchSnapshot();
});

it('highlights day of the week correctly', () => {
	const table = OpeningHoursTable.generateTable('Mo-Su 10:00-19:00', 3);
	expect(table).toMatchSnapshot();
});