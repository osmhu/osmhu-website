import Layer from './Layer';

export default class LayerList {
	constructor() {
		this.layers = [];
	}

	addLayer(layer) {
		if (!(layer instanceof Layer)) {
			throw new Error('layer should be instance of Layer');
		}
		this.layers.push(layer);
	}

	getTitleLeafletLayerMap() {
		const titleLeafletLayerMap = {};

		this.layers.forEach((layer) => {
			titleLeafletLayerMap[layer.title] = layer.getLeafletLayer();
		});

		return titleLeafletLayerMap;
	}

	getById(id) {
		const layersById = {};

		this.layers.forEach((layer) => {
			layersById[layer.id] = layer;
		});

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

		this.layers.forEach((layer) => {
			ids.push(layer.id);
		});

		return ids;
	}
}
