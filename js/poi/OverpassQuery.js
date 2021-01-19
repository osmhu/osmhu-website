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

	static generateQueryByTypeAndId(type, id) {
		if (type !== 'node' && type !== 'way' && type !== 'relation') {
			throw new Error('Invalid element type', type, 'expected node, way or relation');
		}

		return 'interpreter?data=[out:json];(' + type + '(' + id + '););out geom qt 10000;';
	}
}
