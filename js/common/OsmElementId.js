/* istanbul ignore file */

export default class OsmElementId {
	constructor(type, id) {
		this.type = type;
		this.id = id;
	}

	static fromObjectPropertyName(propertyName) {
		const propertyNameParts = propertyName.split('-');
		return new OsmElementId(propertyNameParts[0], propertyNameParts[1]);
	}

	static fromRawObject(object) {
		return new OsmElementId(object.typeValue, object.idValue);
	}

	set type(type) {
		if (type !== 'node' && type !== 'way' && type !== 'relation') {
			throw new Error('Unknown osm element type "' + type + '". Possible values are [node, way, relation]');
		}
		this.typeValue = type;
	}

	get type() {
		return this.typeValue;
	}

	set id(id) {
		this.idValue = parseInt(id, 10);
	}

	get id() {
		return this.idValue;
	}

	toString() {
		return this.typeValue + '(' + this.idValue + ')';
	}

	toObjectPropertyName() {
		return this.typeValue + '-' + this.idValue;
	}
}
