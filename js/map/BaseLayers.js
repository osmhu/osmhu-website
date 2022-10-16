import LayerList from './layers/LayerList';
import TileLayer from './layers/TileLayer';

const baseLayerIds = Object.freeze({
	mapnik: 'M',
	cycle: 'C',
	osmfr: 'F',
	transport: 'T',
	humanitarian: 'H',
});

export default class BaseLayers extends LayerList {
	constructor() {
		super();

		// Default mapnik tiles from https://www.openstreetmap.org
		this.addLayer(new TileLayer({
			id: baseLayerIds.mapnik,
			title: 'Mapnik (Alapértelmezett)',
			layerId: 'OpenStreetMap.Mapnik',
			attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők',
		}));

		/*
		// CyclOSM tiles from https://www.cyclosm.org/
		this.addLayer(new TileLayer({
			id: baseLayerIds.cycle,
			title: 'Kerékpáros térkép',
			layerId: 'CyclOSM',
		}));
		*/

		// OpenCycleMap tiles from https://www.opencyclemap.org/
		// Needs API key from https://manage.thunderforest.com (150,000 tile loads / month)
		this.addLayer(new TileLayer({
			id: baseLayerIds.cycle,
			title: 'Kerékpáros térkép',
			layerId: 'Thunderforest.OpenCycleMap',
			apikey: 'b91d55049c50482da2771ab941a3aeb4',
		}));

		// OpenStreetMap France from https://tile.openstreetmap.fr/
		this.addLayer(new TileLayer({
			id: baseLayerIds.osmfr,
			title: 'OSM France stílus',
			layerId: 'OpenStreetMap.France',
		}));

		// Transport tiles from https://www.thunderforest.com/transport/
		// Needs API key from https://manage.thunderforest.com (150,000 tile loads / month)
		this.addLayer(new TileLayer({
			id: baseLayerIds.transport,
			title: 'Tömegközlekedés',
			layerId: 'Thunderforest.Transport',
			apikey: 'b91d55049c50482da2771ab941a3aeb4',
		}));

		// Humanitarian tiles from https://hot.openstreetmap.org/
		this.addLayer(new TileLayer({
			id: baseLayerIds.humanitarian,
			title: 'Humanitárius',
			layerId: 'OpenStreetMap.HOT',
		}));
	}

	static get ids() {
		return baseLayerIds;
	}

	static get defaultId() {
		return baseLayerIds.mapnik;
	}
}
