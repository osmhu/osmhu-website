const SearchResult = require('./SearchResult');

module.exports = class NominatimResult {
	static convertToSearchResult(nominatimResult) {
		const { primaryName, surroundingArea } = NominatimResult.niceNameFromResult(nominatimResult);

		return new SearchResult(
			nominatimResult.osm_type,
			nominatimResult.osm_id,
			nominatimResult.icon,
			primaryName,
			surroundingArea,
		);
	}

	static niceNameFromResult(nominatimResult) {
		let primaryName;
		const surroundingArea = [];

		if (nominatimResult.address) {
			// If address contains same key as result type, than it is the primary name
			if (Object.hasOwnProperty.call(nominatimResult.address, nominatimResult.type)) {
				primaryName = nominatimResult.address[nominatimResult.type];
			}

			// Highways
			if (nominatimResult.class === 'highway') {
				if (nominatimResult.address.road) {
					primaryName = nominatimResult.address.road;
				}
			}
			// Houses
			if (nominatimResult.class === 'place' && nominatimResult.type === 'house') {
				if (nominatimResult.address.road) {
					primaryName = nominatimResult.address.road;
				}
				if (nominatimResult.address.house_number) {
					primaryName += ` ${nominatimResult.address.house_number}`;
				}
			}

			// Buildings
			if (nominatimResult.class === 'building' && nominatimResult.address.house_number) {
				const firstPartOfDisplayName = NominatimResult.firstPartOfDisplayName(nominatimResult);
				if (firstPartOfDisplayName !== nominatimResult.address.house_number) {
					primaryName = firstPartOfDisplayName;
				} else {
					if (nominatimResult.address.road) {
						primaryName = nominatimResult.address.road;
					}
					primaryName += ` ${nominatimResult.address.house_number}`;
				}
			}

			// Administrative areas
			if (nominatimResult.class === 'boundary' && nominatimResult.type === 'administrative') {
				if (nominatimResult.address.city || nominatimResult.address.village) {
					primaryName = NominatimResult.firstPartOfDisplayName(nominatimResult);
				} else if (nominatimResult.address.country) {
					primaryName = nominatimResult.address.country;
				}
			}

			if (nominatimResult.address.city === 'Budapest' && nominatimResult.address.city_district) {
				surroundingArea.push(nominatimResult.address.city_district);
			}

			if (nominatimResult.type !== 'city' && nominatimResult.type !== 'administrative') {
				if (nominatimResult.address.city) {
					surroundingArea.push(nominatimResult.address.city);
				} else if (nominatimResult.address.town) {
					surroundingArea.push(nominatimResult.address.town);
				} else if (nominatimResult.address.village) {
					surroundingArea.push(nominatimResult.address.village);
				}
			}

			if (nominatimResult.address.country_code === 'hu') {
				if (nominatimResult.address.city !== 'Budapest' && nominatimResult.address.county) {
					surroundingArea.push(nominatimResult.address.county);
				}
			} else if (nominatimResult.address.country
				&& primaryName !== nominatimResult.address.country
			) {
				surroundingArea.push(nominatimResult.address.country);
			}
		}

		// If still no primary name, use first part of display_name
		if (primaryName === undefined) {
			[primaryName] = nominatimResult.display_name.split(', ');
		}

		return {
			primaryName,
			surroundingArea,
		};
	}

	static firstPartOfDisplayName(nominatimResult) {
		if (!nominatimResult.display_name) {
			return '';
		}
		const [firstPartOfDisplayName] = nominatimResult.display_name.split(', ');
		return firstPartOfDisplayName;
	}
};
