function addProtocolIfMissing(url) {
	const urlStartsWithProtocol = url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://';
	if (!urlStartsWithProtocol) {
		return 'http://' + url;
	}
	return url;
}

function removeTrailingSlash(url) {
	if (url.substring(url.length - 1) === '/') {
		return url.substring(0, url.length - 1);
	}
	return url;
}

module.exports = class WebsiteUrl {
	/**
	 * Return shrinked url HTML, but make the full url copyable
	 */
	static shrink(websiteUrl, maxLength) {
		const href = addProtocolIfMissing(websiteUrl);

		// Decode URI
		let niceUrl = decodeURI(websiteUrl);

		// Hide common url beginnings that add no information, but make them copyable
		let hiddenUrlBegin = '';

		const beginningsToRemove = [
			'http://www.',
			'https://www.',
			'http://',
			'https://',
		];
		for (let i = 0; i < beginningsToRemove.length; i++) {
			const beginningToRemove = beginningsToRemove[i];
			if (niceUrl.substring(0, beginningToRemove.length) === beginningToRemove) {
				niceUrl = niceUrl.substring(beginningToRemove.length);
				hiddenUrlBegin = beginningToRemove;
				break;
			}
		}

		let visibleUrl = removeTrailingSlash(niceUrl);

		// Shrink url if too long, but make it copyable
		let hiddenUrlEnd = '';

		if (visibleUrl.length > maxLength + 2) {
			visibleUrl = niceUrl.substring(0, maxLength);
			hiddenUrlEnd = niceUrl.substring(maxLength);
		}
		let html = '';
		html += '<span class="website-url"><a href="' + href + '" target="_blank" title="' + (visibleUrl !== niceUrl ? niceUrl : '') + '">';
		if (hiddenUrlBegin.length > 0) {
			html += '<span class="hidden-part">' + hiddenUrlBegin + '</span>';
		}
		html += visibleUrl;
		if (hiddenUrlEnd.length > 0) {
			html += '<span class="hidden-part">' + hiddenUrlEnd + '</span>';
			html += '<span class="hidden-indicator"></span>';
		}
		html += '</a></span>';

		return html;
	}
};
