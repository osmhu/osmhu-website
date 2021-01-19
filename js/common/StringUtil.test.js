import StringUtil from './StringUtil';

describe('upperCaseFirstLetter', () => {
	it('should uppercase first letter', () => {
		expect(StringUtil.upperCaseFirstLetter('')).toEqual('');
		expect(StringUtil.upperCaseFirstLetter('abc')).toEqual('Abc');
		expect(StringUtil.upperCaseFirstLetter('Abc')).toEqual('Abc');
		expect(StringUtil.upperCaseFirstLetter('árvíztűrő tükörfúrógép')).toEqual('Árvíztűrő tükörfúrógép');
	});
});
