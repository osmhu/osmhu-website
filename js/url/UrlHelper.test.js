import UrlHelper from './UrlHelper';

describe('sanitize', () => {
	test('should escape & character', () => {
		expect(UrlHelper.sanitizeTextForHtmlDisplay('C & A')).toEqual('C &amp; A');
	});

	test('should escape HTML tags', () => {
		expect(UrlHelper.sanitizeTextForHtmlDisplay('<script type="text/javascript">alert("McDonald\'s")</script>'))
			.toEqual('&lt;script type=&quot;text/javascript&quot;&gt;alert(&quot;McDonald&#x27;s&quot;)&lt;/script&gt;');
	});

	test('should escape newlines', () => {
		expect(UrlHelper.sanitizeTextForHtmlDisplay('New\n\nlines')).toEqual('New<br><br>lines');
		expect(UrlHelper.sanitizeTextForHtmlDisplay('New\r\n\r\nlines')).toEqual('New<br><br>lines');
	});
});

describe('round', () => {
	test.each([
		[47.498401256, 47.49840],
		[47.498431256, 47.49843],
		[19.041157521, 19.04116],
		[47.498439256, 47.49844],
	])('should return five digits with last digit rounded', (input, expected) => {
		expect(UrlHelper.roundToFiveDigits(input)).toEqual(expected);
	});
});
