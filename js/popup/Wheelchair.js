const baseUrl = 'https://wheelmap.org';

function createUrl(id, type) {
	let url;
	if (type === 'node') {
		url = baseUrl + '/nodes/' + id;
	} else if (type === 'way') {
		url = baseUrl + '/nodes/-' + id;
	} else {
		return false;
	}
	return url;
}

module.exports = class Wheelchair {
	static createLogo(id, type, tags) {
		let html = '<div class="wheelchair">';
		const wheelMapUrl = createUrl(id, type);
		if (wheelMapUrl) {
			html += '<a href="' + wheelMapUrl + '" target="_blank">';
		}
		let image;
		let status;
		if (tags.wheelchair === 'yes') {
			image = 'wheelchair-green.png';
			status = 'akadálymentes';
		} else if (tags.wheelchair === 'limited') {
			image = 'wheelchair-yellow.png';
			status = 'részben akadálymentes';
		} else if (tags.wheelchair === 'no') {
			image = 'wheelchair-red.png';
			status = 'nem akadálymentes';
		} else {
			return '';
		}

		html += '<img src="/kepek/' + image + '" alt="' + status + '" title="' + status + '">';
		if (wheelMapUrl) {
			html += '</a>';
		}
		html += '</div>';

		return html;
	}
};
