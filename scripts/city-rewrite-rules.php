<?php

include dirname(__FILE__) . '/../lib.php';

// Letter replace for accent-less short URL display
$letterReplaceRules = array(
	'á' => 'a', 'é' => 'e', 'í' => 'i',
	'ó' => 'o', 'ö' => 'o', 'ő' => 'o',
	'ú' => 'u', 'ü' => 'u', 'ű' => 'u',
	'Á' => 'a', 'É' => 'e', 'Í' => 'i',
	'Ó' => 'o', 'Ö' => 'o', 'Ő' => 'o',
	'Ú' => 'u', 'Ü' => 'u', 'Ű' => 'u'
);

$streetDb = new StreetsDB();
$list = $streetDb->load_cities();

foreach ($list as $city) {
	if ($city->name != 'Kömörő') { // Conflicts with Komoró
		$lowercaseCityName = strtolower(strtr($city->name, $letterReplaceRules));
	} else {
		$lowercaseCityName = 'kömörő';
	}

	if (strpos($lowercaseCityName, 'budapest') === 0) {
		if ($lowercaseCityName != 'budapest i.') {
			continue;
		}
		$city->name = 'Budapest';
	}

	$cityNameForUrl = genregex($city->name);
	$lat = number_format($city->lat, 5, '.', ',');
	$lon = number_format($city->lon, 5, '.', ',');

	echo 'RewriteRule ^terkep\/' . $cityNameForUrl . '/?$ \/?zoom=15\&lat=' . $lat . '\&lon=' . $lon . ' [R]' . PHP_EOL;
}

// Makes an accent insensitve, case insensitive converted regex for city name
// Hardcoded Kömörő fix!
function genregex($name)
{
	if ($name == 'Kömörő') {
		return '(K|k)ömörő'; // Conflicts with Komoró otherwise
	}

	$n = str_replace('á', '(á|a)', $name);
	$n = str_replace('é', '(é|e)', $n);
	$n = str_replace('í', '(í|i)', $n);
	$n = str_replace('ó', '(ó|o)', $n);
	$n = str_replace('ö', '(ö|o)', $n);
	$n = str_replace('ő', '(ő|o)', $n);
	$n = str_replace('ú', '(ú|u)', $n);
	$n = str_replace('ü', '(ü|u)', $n);
	$n = str_replace('ű', '(ű|u)', $n);

	$n = str_replace('Á', '(Á|A|á|a)', $n);
	$n = str_replace('É', '(É|E|é|e)', $n);
	$n = str_replace('Í', '(Í|I|í|i)', $n);
	$n = str_replace('Ó', '(Ó|O|ó|o)', $n);
	$n = str_replace('Ö', '(Ö|O|ö|o)', $n);
	$n = str_replace('Ő', '(Ő|O|ő|o)', $n);
	$n = str_replace('Ú', '(Ú|U|ú|u)', $n);
	$n = str_replace('Ü', '(Ü|U|ü|u)', $n);
	$n = str_replace('Ű', '(Ű|U|ű|u)', $n);

	// Escape any space character in regex
	$n = str_replace(' ', '\ ', $n);

	// For non-accented first letters make case-insensitve start
	if (substr($n, 0, 1) != '(') {
		$n = '(' . substr($name, 0, 1) . '|' . strtolower(substr($name, 0, 1)) . ')' . substr($n, 1);
	}

	return $n;
}
