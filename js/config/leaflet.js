var options = module.exports = {};


options.locate = {
	drawCircle: false,
	icon:      'fa fa-location-arrow',
	strings: {
		title: 'Pozíció meghatározása',  // title of the locate control
		popup: 'Ennek a pontnak a {distance} méteres körzetében vagy',  // text to appear if user clicks on circle
		outsideMapBoundsMsg: 'Úgy tűnik a látható területen kívül vagy' // default message for onLocationOutsideMapBounds
	}
};

options.scale = {
	maxWidth: 200,
	imperial: false
};
