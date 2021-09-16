export default class OverpassQuery {
	static generateQuery(criteria) {
		let queryBody = this.generateQueryForNode(criteria);
		queryBody += this.generateQueryForWay(criteria);
		queryBody += this.generateQueryForRelation(criteria);
		return '(' + queryBody + ');out bb qt;';
	}

	static generateQueryForNode(criteria) {
		let query = '';
		Object.values(criteria).forEach((tags) => {
			query += this.generateQueryPartFromTags('node', tags);
		});
		if (criteria.length > 1) {
			return '(' + query + ');';
		}
		return query;
	}

	static generateQueryForWay(criteria) {
		let query = '';
		Object.values(criteria).forEach((tags) => {
			query += this.generateQueryPartFromTags('way', tags);
		});
		if (criteria.length > 1) {
			return '(' + query + ');';
		}
		return query;
	}

	static generateQueryForRelation(criteria) {
		let query = '';
		Object.values(criteria).forEach((tags) => {
			query += this.generateQueryPartFromTags('rel', tags);
		});
		if (criteria.length > 1) {
			return '(' + query + ');';
		}
		return query;
	}

	static generateQueryPartFromTags(objectType, tag) {
		const queryStart = objectType + '({{bbox}})';
		let queryBody = '';
		Object.keys(tag).forEach((key) => {
			queryBody += '["' + key + '"="' + tag[key] + '"]';
		});
		const queryEnd = ';';
		return queryStart + queryBody + queryEnd;
	}

	static generateQueryByOsmElementId(osmElementId) {
		return 'interpreter?data=[out:json];(' + osmElementId.type + '(' + osmElementId.id + '););out geom qt 10000;';
	}
}
