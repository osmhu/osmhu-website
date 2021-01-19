import Layer from './Layer';

export default class LayerList {
	constructor(layers) {
		Object.values(layers).forEach((layer) => {
			if (!(layer instanceof Layer)) {
				throw new Error('All values of layers parameter should be instance of Layer');
			}
		});

		this.layers = layers;
	}

	getIdValueHash() {
		const layersById = {};

		Object.keys(this.layers).forEach((key) => {
			const layer = this.layers[key];
			layersById[layer.id] = layer;
		});

		return layersById;
	}

	getLeafletLayersByDisplayName() {
		const layersByDisplayName = {};

		Object.keys(this.layers).forEach((key) => {
			const layer = this.layers[key];
			layersByDisplayName[layer.displayName] = layer.getLayer();
		});

		return layersByDisplayName;
	}

	getById(id) {
		const layersById = this.getIdValueHash();

		let layer;
		if (Object.hasOwnProperty.call(layersById, id)) {
			layer = layersById[id];
		} else {
			throw new Error(`Unknown layer: ${id}`);
		}

		return layer;
	}

	getAllIds() {
		const ids = [];

		Object.keys(this.layers).forEach((key) => {
			const layer = this.layers[key];
			ids.push(layer.id);
		});

		return ids;
	}
}
