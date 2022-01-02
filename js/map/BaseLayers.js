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
		this.addLayer(new TileLayer(baseLayerIds.mapnik, 'Mapnik (Alapértelmezett)', 'OpenStreetMap.Mapnik', {
			attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők',
		}));

		// CyclOSM tiles from https://www.cyclosm.org/
		// this.addLayer(new TileLayer(baseLayerIds.cycle, 'Kerékpáros térkép', 'CyclOSM'));

		// OpenCycleMap tiles from https://www.opencyclemap.org/, needs API key from https://manage.thunderforest.com (150,000 tile loads / month)
		this.addLayer(new TileLayer(baseLayerIds.cycle, 'Kerékpáros térkép', 'Thunderforest.OpenCycleMap', {
			apikey: 'b91d55049c50482da2771ab941a3aeb4',
		}));

		// OpenStreetMap France from https://tile.openstreetmap.fr/
		this.addLayer(new TileLayer(baseLayerIds.osmfr, 'OSM France stílus', 'OpenStreetMap.France'));

		// Transport tiles from https://www.thunderforest.com/transport/, needs API key from https://manage.thunderforest.com (150,000 tile loads / month)
		this.addLayer(new TileLayer(baseLayerIds.transport, 'Tömegközlekedés', 'Thunderforest.Transport', {
			apikey: 'b91d55049c50482da2771ab941a3aeb4',
		}));

		// Humanitarian tiles from https://hot.openstreetmap.org/
		this.addLayer(new TileLayer(baseLayerIds.humanitarian, 'Humanitárius', 'OpenStreetMap.HOT'));
	}

	static get ids() {
		return baseLayerIds;
	}

	static get defaultId() {
		return baseLayerIds.mapnik;
	}
}
