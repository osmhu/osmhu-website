const L = require('leaflet');

const IconProvider = require('./IconProvider');

const assertIcon = (icon, expectedIcon) => {
	expect(icon).toBeInstanceOf(L.Icon);
	expect(icon.options.iconUrl).toEqual('/vendor/mapiconscollection/' + expectedIcon);
};

it('should return restaurant icon when amenity=restaurant', () => {
	const iconProvider = new IconProvider({
		amenity: 'restaurant',
	});

	const icon = iconProvider.getFirstMatchingIcon();
	assertIcon(icon, 'restaurant.png');
});

it('should return bar icon when amenity=bar and shop=greengrocer', () => {
	const iconProvider = new IconProvider({
		amenity: 'bar',
		shop: 'greengrocer',
	});

	const icon = iconProvider.getFirstMatchingIcon();
	assertIcon(icon, 'bar.png');
});

it('should return lake icon when natural=beach', () => {
	const iconProvider = new IconProvider({
		natural: 'beach',
	});

	const icon = iconProvider.getFirstMatchingIcon();
	assertIcon(icon, 'lake.png');
});

it('should throw exception with no tags', () => {
	const iconProvider = new IconProvider({});

	expect(() => {
		iconProvider.getFirstMatchingIcon();
	}).toThrowError('No tag matched');
});
