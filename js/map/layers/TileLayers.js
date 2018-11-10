const LayerList = require('../../layers/LayerList');
const TileLayer = require('../../layers/TileLayer');

module.exports = class TileLayers extends LayerList {
	constructor() {
		const layers = {};

		/**
		* Default mapnik tiles from http://www.openstreetmap.org
		*/
		layers.mapnik = new TileLayer(
			'M',
			'Mapnik (Alapértelmezett)',
			'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			19,
		);

		/**
		* OpenCycleMap tiles from http://www.opencyclemap.org/
		* Needs registered API key from https://manage.thunderforest.com (currently supports 150,000 tile loads / month)
		*/
		layers.cycle = new TileLayer(
			'C',
			'Kerékpáros térkép',
			'http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=b91d55049c50482da2771ab941a3aeb4',
			18,
		);

		/**
		* OpenStreetMap France from http://tile.openstreetmap.fr/
		*/
		layers.osmfr = new TileLayer(
			'F',
			'OSM France stílus',
			'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
			20,
		);

		/**
		* Transport tiles from http://www.thunderforest.com/transport/
		* Needs registered API key from https://manage.thunderforest.com (currently supports 150,000 tile loads / month)
		*/
		layers.transport = new TileLayer(
			'T',
			'Tömegközlekedés',
			'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b91d55049c50482da2771ab941a3aeb4',
			18,
		);

		/**
		* Humanitarian tiles from http://hot.openstreetmap.org/ (url from OpenStreetmap.org)
		*/
		layers.humanitarian = new TileLayer(
			'H',
			'Humanitárius',
			'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
			20,
		);

		super(layers);
	}
};
