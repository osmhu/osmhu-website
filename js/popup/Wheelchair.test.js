import OsmElementId from '../common/OsmElementId';

import PoiRelevantContent from './PoiRelevantContent';
import Wheelchair from './Wheelchair';

const createPoiRelevantContentFromTypeIdAndWheelChairTagValue = (type, id, wheelchairTagValue) => {
	const osmElementId = new OsmElementId(type, id);
	const poiRelevantContent = new PoiRelevantContent(osmElementId);
	poiRelevantContent.wheelchair = wheelchairTagValue;
	return poiRelevantContent;
};

it.each([
	'node',
	'way',
	'relation',
])('renders correctly for accessible %s', (type) => {
	const poiRelevantContent = createPoiRelevantContentFromTypeIdAndWheelChairTagValue(type, 10, 'yes');
	const html = Wheelchair.createLogo(poiRelevantContent);

	expect(html).toMatchSnapshot();
});

it.each([
	'node',
	'way',
	'relation',
])('renders correctly for limited %s', (type) => {
	const poiRelevantContent = createPoiRelevantContentFromTypeIdAndWheelChairTagValue(type, 20, 'limited');
	const html = Wheelchair.createLogo(poiRelevantContent);

	expect(html).toMatchSnapshot();
});

it.each([
	'node',
	'way',
	'relation',
])('renders correctly for inaccessible %s', (type) => {
	const poiRelevantContent = createPoiRelevantContentFromTypeIdAndWheelChairTagValue(type, 30, 'no');
	const html = Wheelchair.createLogo(poiRelevantContent);

	expect(html).toMatchSnapshot();
});

it('renders nothing if wheelchair tag is empty', () => {
	const poiRelevantContent = createPoiRelevantContentFromTypeIdAndWheelChairTagValue('node', 10, '');
	const html = Wheelchair.createLogo(poiRelevantContent);

	expect(html).toEqual('');
});
