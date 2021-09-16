import PopupHtmlCreatorSingle from './PopupHtmlCreatorSingle';

describe('address', () => {
	it('should return city, street and housenumber with a point at the end when housenumber is number', () => {
		const displayedAddress = PopupHtmlCreatorSingle.address({
			displayable: true,
			city: 'Kecskemét',
			street: 'Kossuth tér',
			housenumber: '1',
		});

		expect(displayedAddress).toEqual('Kecskemét, Kossuth tér 1.');
	});

	it('should return city, street and housenumber', () => {
		const displayedAddress = PopupHtmlCreatorSingle.address({
			displayable: true,
			city: 'Kecskemét',
			street: 'Kossuth tér',
			housenumber: '1/b',
		});

		expect(displayedAddress).toEqual('Kecskemét, Kossuth tér 1/b');
	});
});
