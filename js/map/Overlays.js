import LayerList from './layers/LayerList';
import GeoJsonLayer from './layers/GeoJsonLayer';
import CustomTileLayer from './layers/CustomTileLayer';

const overlayIds = Object.freeze({
	tourist: 'tur',
	okt: 'okt',
	ddk: 'ddk',
	akt: 'akt',
});

export default class Overlays extends LayerList {
	constructor() {
		super();

		this.addLayer(new CustomTileLayer(overlayIds.tourist, 'Turistautak', 'https://{s}.tile.openstreetmap.hu/tt/{z}/{x}/{y}.png', {
			maxZoom: 19,
			maxNativeZoom: 17,
		}));

		this.addLayer(new GeoJsonLayer(overlayIds.okt, 'Országos Kéktúra',
			'https://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=3020505'));

		this.addLayer(new GeoJsonLayer(overlayIds.ddk, 'Dél-Dunántúli Kéktúra',
			'https://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=289362'));

		this.addLayer(new GeoJsonLayer(overlayIds.akt, 'Alföldi Kéktúra',
			'https://data2.openstreetmap.hu/turistautak/psgeojson.php?turut=2164968'));
	}

	static get ids() {
		return overlayIds;
	}
}
