module.exports = class StringUtil {
	static upperCaseFirstLetter(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
};
