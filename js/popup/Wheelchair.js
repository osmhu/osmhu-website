const baseUrl = 'https://wheelmap.org';

function createUrl(osmElementId) {
	let url;
	if (osmElementId.type === 'node') {
		url = baseUrl + '/nodes/' + osmElementId.id;
	} else if (osmElementId.type === 'way') {
		url = baseUrl + '/nodes/-' + osmElementId.id;
	} else {
		return false;
	}
	return url;
}

export default class Wheelchair {
	static createLogo(poiRelevantContent) {
		let html = '<div class="wheelchair">';
		const wheelMapUrl = createUrl(poiRelevantContent.osmElementId);
		if (wheelMapUrl) {
			html += '<a href="' + wheelMapUrl + '" target="_blank">';
		}
		let image;
		let status;
		if (poiRelevantContent.wheelchair === 'yes') {
			image = 'wheelchair-green.png';
			status = 'akadálymentes';
		} else if (poiRelevantContent.wheelchair === 'limited') {
			image = 'wheelchair-yellow.png';
			status = 'részben akadálymentes';
		} else if (poiRelevantContent.wheelchair === 'no') {
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
}
