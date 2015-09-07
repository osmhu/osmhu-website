var promotion = module.exports = {};

// Since in javascript months start with 0, so 2015.09.26 09:00 becomes 2015.8.26 09:00
var end_date = new Date(2015,8,26,9,0,1);

var template = '<p><strong>Akadálymentes térképezés</strong></p>';
template+= '<div style="float: left; padding: 0 4px 0 8px"><a href="https://www.facebook.com/events/139192116425139/" target="_blank"><img src="/kepek/map-159714_640.png" alt="Akadálymentes térképezés logója"></a></div>';
template+= '<div style="float: left"><span><strong>Győr</strong>, szeptember 26.</span>';
template+= '<p><span class="remaining-days">0</span> nap ';
template+= '<span class="remaining-hours">00</span>:';
template+= '<span class="remaining-minutes">00</span>:';
template+= '<span class="remaining-seconds">00</span> múlva</p>';
template+= '<p><div class="fbstyle"><a class="fblink" href="https://www.facebook.com/events/139192116425139/" target="_blank">Esemény oldal</a></div></p></div><div style="clear: both"></div>';

promotion.calculateDiff = function () {
	now = new Date();

	var diff = end_date.getTime() - now.getTime();

	if (diff < 0) return;

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

// Not passed yet
if (diff > 0) {
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
