/* istanbul ignore file */
/* globals window */

module.exports = class HistoryApi {
	static replaceState(queryString) {
		// http://diveintohtml5.info/everything.html#history
		if (window.history && window.history.pushState) {
			window.history.replaceState(null, window.document.title, queryString);
		}
	}
};
