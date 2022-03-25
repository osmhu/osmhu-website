import L from 'leaflet';
import log from 'loglevel';

import CopyButton from '../common/CopyButton';
import MarkerCreatorControl from '../map/controls/MarkerCreatorControl';
import UrlParamChangeNotifier from '../url/UrlParamChangeNotifier';

export default class Share {
	constructor(map) {
		this.map = map;
		this.shareMarker = null; // L.Marker

		this.addControlToMap();
	}

	addControlToMap() {
		this.map.addControl(new MarkerCreatorControl(this).getMapControl());
	}

	uniqueId() {
		return this.map.getId();
	}

	getText() {
		if (this.shareMarker && this.shareMarker.text) {
			return this.shareMarker.text.trim();
		}
		return '';
	}

	setText(text) {
		this.shareMarker.text = text;
		UrlParamChangeNotifier.trigger();
	}

	getMarkerPosition() {
		return this.shareMarker.getLatLng();
	}

	isOpen() {
		return this.shareMarker !== null;
	}

	toggle() {
		if (this.isOpen()) {
			this.closePopup();
		} else {
			this.openPopup();
		}
		UrlParamChangeNotifier.trigger();
	}

	createPopupAndOpen() {
		this.shareMarker.bindPopup(this.popupHtmlContent(), {
			closeButton: false,
			closeOnClick: false,
		}).openPopup();
	}

	openPopup() {
		const mapCenter = this.map.getCenter();

		this.shareMarker = L.marker([mapCenter.lat, mapCenter.lng], {
			draggable: true,
			autoPan: true,
			zIndexOffset: 1000,
		});

		this.shareMarker.on('dragend', () => {
			const markerPosition = this.shareMarker.getLatLng();
			this.map.setView([markerPosition.lat, markerPosition.lng]);

			this.shareMarker.openPopup();
		});

		this.shareMarker.on('popupopen', () => {
			this.textFieldHtmlElement.focus();

			const needToUpdate = this.textFieldHtmlElement.value !== this.getText();
			if (needToUpdate) {
				this.textFieldHtmlElement.value = this.getText();
			}
			UrlParamChangeNotifier.trigger();
			this.bindPopupActions();
		});

		this.map.addLayer(this.shareMarker);

		this.createPopupAndOpen();
	}

	bindPopupActions() {
		this.closeButtonHtmlElement.addEventListener('click', (event) => {
			event.preventDefault();
			this.closePopup();
		});

		this.urlFieldHtmlElement.addEventListener('click', () => {
			this.urlFieldHtmlElement.select();
		});

		this.textFieldHtmlElement.addEventListener('keyup', () => {
			const text = this.textFieldHtmlElement.value;
			this.setText(text);
		});

		CopyButton.copyTargetOnButtonClick(this.copyButtonHtmlElement, this.urlFieldHtmlElement);
	}

	closePopup() {
		if (this.map.hasLayer(this.shareMarker)) {
			this.map.removeLayer(this.shareMarker);
		}
		this.shareMarker = null;
		UrlParamChangeNotifier.trigger();
	}

	popupHtmlContent() {
		const uniqueId = this.uniqueId();
		return `
			<div class="send-location-popup">
				<a id="send-location-popup-${uniqueId}-close" class="leaflet-popup-close-button" href="#close">×</a>
				<h1>Hely küldése:</h1>
				<textarea id="send-location-popup-${uniqueId}-text" rows="2" placeholder="Megjelenő szöveg"></textarea>
				<p>Hivatkozás: <input type="text" id="send-location-popup-${uniqueId}-url"
					class="send-location-url" readonly="readonly" ></p>
				<button id="send-location-popup-${uniqueId}-copy" type="button"
					data-clipboard-target="send-location-popup-${uniqueId}-url">Hivatkozás másolása</button>
			</div>
		`;
	}

	getHtmlElement(htmlContentSelector) {
		const htmlElement = document.getElementById('send-location-popup-' + this.uniqueId() + '-' + htmlContentSelector);
		if (!htmlElement) {
			log.debug('html element ' + htmlContentSelector + ' not found on share popup: ' + this.uniqueId());
			throw new Error('html element not found');
		}
		return htmlElement;
	}

	get closeButtonHtmlElement() {
		return this.getHtmlElement('close');
	}

	get textFieldHtmlElement() {
		return this.getHtmlElement('text');
	}

	get urlFieldHtmlElement() {
		return this.getHtmlElement('url');
	}

	get copyButtonHtmlElement() {
		return this.getHtmlElement('copy');
	}
}
