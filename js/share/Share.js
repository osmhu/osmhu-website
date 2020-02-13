const share = require('../share');

module.exports = class Share {
	static isOpen() {
		return share.isOpen();
	}

	static getMarkerPosition() {
		return share.getMarkerPosition();
	}

	static getText() {
		return share.getText();
	}
};
