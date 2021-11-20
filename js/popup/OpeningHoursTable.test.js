import OpeningHoursTable from './OpeningHoursTable';

it('throws error for invalid opening hours string', () => {
	expect(() => {
		OpeningHoursTable.generateTable('invalidString', 1);
	}).toThrow();
});

it('renders correctly for non-stop poi', () => {
	const table = OpeningHoursTable.generateTable('24/7', 1);
	expect(table).toMatchSnapshot();
});

it('renders correctly for Mo-Su 10:00-19:00', () => {
	const table = OpeningHoursTable.generateTable('Mo-Su 10:00-19:00', 1);
	expect(table).toMatchSnapshot();
});

it('renders correctly for Mo-Fr 09:00-00:00', () => {
	const table = OpeningHoursTable.generateTable('Mo-Fr 09:00-00:00', 1);
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
