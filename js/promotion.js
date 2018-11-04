var promotion = module.exports = {};

// Since in javascript month index starts with 0, must substract one, so 13th nov becomes 10, 13
var end_date = new Date(2018, 10, 13, 17, 45, 1);

var template = '<div style="text-align: center"><p style="margin: 12px 0 8px" class="title"><strong>Élő térképszerkesztés</strong></p>';
template += '<p style="margin: 8px 0">az <a href="http://fsf.hu/" target="_blank" title="FSF.hu weboldal"><span style="color: #990000">FSF.hu</span></a> szervezésében:</p>';
template += '<div style="padding: 10px 0 10px 8px">';
template += '<a style="text-decoration: underline; cursor: pointer;" onClick="searchDetails(\'node\', \'5343540922\', [47.5050959, 47.5051959, 19.0567591, 19.0568591],{ name: \'D18 Könyvesbolt és Kávézó\', lat: 47.5051459, lon: 19.0568091}); $(\'#text-search\').val(\'Budapest, Dessewffy utca 18.\')" title="Budapest, Dessewffy utca 18.">';
template += '<span><strong>Budapest</strong>, D18 Café</span>';
template += '</a></div>';
template += '<div style="padding: 10px 0 10px 8px"><span>2018 <strong>november 13.</strong> 17:45</span></div>';
template += '<div class="fbstyle" style="margin: 8px 40px 16px"><a class="fbpage" href="https://www.facebook.com/events/272083416782262/" target="_blank">Facebook Esemény</a></div></div>';
template += '<p style="margin: 8px 0 16px" class="countdown"><span class="remaining-days">0</span> nap ';
template += '<span class="remaining-hours">00</span>:';
template += '<span class="remaining-minutes">00</span>:';
template += '<span class="remaining-seconds">00</span> múlva</p>';
template += '</div>';

promotion.calculateDiff = function () {
	now = new Date();

	var diff = end_date.getTime() - now.getTime();

	if (diff < 0) return false;

	var diffDays = Math.floor(diff / (1000 * 3600 * 24));
	var diffHoursMinutesSeconds = diff - (diffDays * 1000 * 3600 * 24);
	var diffHours = Math.floor(diffHoursMinutesSeconds / (1000 * 3600));
	var diffMinutesSeconds = diffHoursMinutesSeconds - (diffHours * 1000 * 3600);
	var diffMinutes = Math.floor(diffMinutesSeconds / (1000 * 60));
	var diffSeconds = Math.floor((diffMinutesSeconds - (diffMinutes * 1000 * 60)) / 1000);

	if (diffHours < 10) {
		diffHours = '0' + diffHours
	}
	if (diffMinutes < 10) {
		diffMinutes = '0' + diffMinutes
	}
	if (diffSeconds < 10) {
		diffSeconds = '0' + diffSeconds
	}

	return {
		days:    diffDays,
		hours:   diffHours,
		minutes: diffMinutes,
		seconds: diffSeconds
	};
};

var now = new Date();
var diff = end_date.getTime() - now.getTime();

var visibleAfterZero = 1000 * 60 * 60 * 3.25; // 3 hours 15 minutes - length of the meetup

// Not passed yet
if (diff > (visibleAfterZero * -1)) {
	$('.project').show();
	$('.project').html(template);

	setInterval(function () {
		if (!$('#introduction').is(':visible')) {
			return;
		}

		var diff = promotion.calculateDiff();

		if (diff) {
			$('.project .remaining-days').html(diff.days);
			$('.project .remaining-hours').html(diff.hours);
			$('.project .remaining-minutes').html(diff.minutes);
			$('.project .remaining-seconds').html(diff.seconds);
		}
	}, 1000);
}
