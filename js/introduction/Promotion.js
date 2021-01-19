import $ from 'jquery';
import {
	format, parse, formatDistanceStrict, differenceInMinutes,
} from 'date-fns';
import huLocale from 'date-fns/locale';

const eventStart = parse('2018-11-13 17:45:00');
const visibleForMinutesAfterStart = 180;

const formattedYear = format(eventStart, 'YYYY');
const formattedDay = format(eventStart, 'MMMM D.');
const formattedTime = format(eventStart, 'HH:mm');

const template = `
	<div style="text-align: center; border-bottom: 1px solid #aaa;">
		<p style="margin: 12px 0 8px" class="title"><strong>Élő térképszerkesztés</strong></p>
		<p style="margin: 8px 0">az <a href="http://fsf.hu/" target="_blank" title="FSF.hu weboldal"><span style="color: #990000">FSF.hu</span></a> szervezésében:</p>
		<p style="margin: 16px 0 8px 0">
			<a class="open-poi" style="text-decoration: underline; cursor: pointer;" title="Budapest, Dessewffy utca 18.">
				<span><strong>Budapest</strong>, D18 Café</span>
			</a>
		</p>
		<div style="padding: 10px 0 10px 8px"><span>${formattedYear} <strong>${formattedDay}</strong> ${formattedTime}</span></div>
		<p style="margin: 8px 0 16px" class="countdown">
			<span class="remaining"></span>
		</p>
		<div class="fbstyle" style="margin: 8px 32px 16px"><a class="fbpage" href="https://www.facebook.com/events/272083416782262/" target="_blank">Facebook Esemény</a></div>
	</div>
`;

export default class Promotion {
	constructor(introduction, searchResults) {
		this.introduction = introduction;
		this.searchResults = searchResults;

		this.$promotion = $('.promotion');
	}

	initUi() {
		const now = new Date();
		const minutesTillStart = differenceInMinutes(eventStart, now);
		const displayPromotion = minutesTillStart > (-1 * visibleForMinutesAfterStart);

		if (displayPromotion) {
			this.$promotion.show();
			this.$promotion.html(template);
			this.$promotion.find('.open-poi').on('click', () => {
				this.searchResults.showResultOnMap({
					type: 'node',
					id: 5343540922,
				});
			});

			this.tick();

			setInterval(this.tick.bind(this), 10000);
		}
	}

	tick() {
		if (!this.introduction.isVisible()) {
			return;
		}

		const now = new Date();
		const minutesTillStart = differenceInMinutes(eventStart, now);
		if (minutesTillStart > 0) {
			const distanceFormatted = formatDistanceStrict(eventStart, new Date(), {
				addSuffix: true,
				locale: huLocale,
			});

			this.$promotion.find('.remaining').html(distanceFormatted + ' múlva');
		}
	}
}
