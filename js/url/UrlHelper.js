module.exports = class UrlHelper {
	static roundToFiveDigits(coordinate) {
		const rounding = 100000;
		return Math.round(coordinate * rounding) / rounding;
	}

	static sanitizeTextForHtmlDisplay(text) {
		return text.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/'/g, '&#x27;')
			.replace(/"/g, '&quot;')
			.replace(/\r?\n/g, '<br>'); // Replace newline with <br>
	}
};
