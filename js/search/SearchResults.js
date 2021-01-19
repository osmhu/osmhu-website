/* globals window */

import $ from 'jquery';

import LoadingIndicator from '../common/LoadingIndicator';
import Marker from '../marker/Marker';
import MobileDetector from '../common/MobileDetector';

import SearchResult from './SearchResult';

export default class SearchResults {
	constructor(map, searchResultsSelector) {
		this.map = map;
		this.$searchResults = $(searchResultsSelector);

		this.$searchResults.find('a.close').on('click', () => {
			this.$searchResults.hide();

			$(window).trigger('search-results-hide');
		});

		this.visibleSearchResultLayerOnMap = null;
	}

	isActive() {
		return this.$searchResults.is(':visible');
	}

	showResults(results) {
		if (results.length === 0) {
			this.$searchResults.find('.no-results').show();
			this.$searchResults.find('.results').hide();
		} else {
			this.$searchResults.find('.no-results').hide();
			this.$searchResults.find('.results').html('');
			results.forEach((result) => {
				this.$searchResults.find('.results').append(SearchResults.generateHtmlForResult(result));
				this.$searchResults.find(`.results .result a#search-result-${result.type}-${result.id}`).on('click', () => this.showResultOnMap(result));
			});
			this.$searchResults.find('.results').show();
		}
		this.$searchResults.show();
		$(window).trigger('search-results-show');
	}

	async showResultOnMap(result) {
		if (this.visibleSearchResultLayerOnMap) {
			this.map.removeLayer(this.visibleSearchResultLayerOnMap);
			this.visibleSearchResultLayerOnMap = null;
		}

		if (MobileDetector.isMobile()) {
			this.$searchResults.hide(200);
		}

		LoadingIndicator.setLoading(true);
		this.visibleSearchResultLayerOnMap = await Marker.fromTypeAndId(result.type, result.id, this.map);
		LoadingIndicator.setLoading(false);
	}

	static generateHtmlForResult(result) {
		if (!(result instanceof SearchResult)) {
			throw new Error('result must be instanceof SearchResult');
		}

		let row = `
			<div class="result">
				<a id="search-result-${result.type}-${result.id}">
		`;

		if (result.icon) {
			row += `
				<span class="icon">
					<img src="${result.icon}">
				</span>
			`;
		}

		row += result.primaryName;
		if (result.surroundingArea.length > 0) {
			row += ' - ' + result.surroundingArea.join(' - ');
		}

		row += `
				</a>
			</div>
		`;

		return row;
	}
}
