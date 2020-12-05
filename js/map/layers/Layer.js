const attribution = '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap közreműködők</a>';

module.exports = class Layer {
	constructor(id, displayName, url) {
		this.id = id;
		this.displayName = displayName;
		this.url = url;
		this.maxZoom = null;
		this.subdomains = 'abc';
		this.attribution = attribution;
		this.layer = null;
	}

	getLayer() {
		if (this.url == null) throw new Error('Layer url must be set');

		if (this.layer) {
			return this.layer;
		}

		return false;
	}
};
