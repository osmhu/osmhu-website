import OsmElementId from './OsmElementId';

export default class OsmElement {
	constructor(id, tags) {
		if (!(id instanceof OsmElementId)) {
			throw new Error('OsmElement id must be instance of OsmElementId');
		}
		this.id = id;
		this.tags = tags;
	}

	static fromRawObject(object) {
		const osmElementId = OsmElementId.fromRawObject(object.id);
		return new OsmElement(osmElementId, object.tags);
	}
}
