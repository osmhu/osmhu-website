<?php
// Not allowed from web
if(empty($argc)) {
	exit;
}


class Place {
	public $name;
	public $type;
	public $lat;
	public $lon;
	function __construct($name,$type,$lat,$lon) {
		$this->name = $name;
		$this->type = $type;
		$this->lat = $lat;
		$this->lon = $lon;
	}

	public function getNameRegexp() {

		// Allow accent-less names
		$rx = str_replace('á', '(á|a)', $this->name);
		$rx = str_replace('é', '(é|e)', $rx);
		$rx = str_replace('í', '(í|i)', $rx);
		$rx = str_replace('ó', '(ó|o)', $rx);
		$rx = str_replace('ö', '(ö|o)', $rx);
		$rx = str_replace('ő', '(ő|o)', $rx);
		$rx = str_replace('ú', '(ú|u)', $rx);
		$rx = str_replace('ü', '(ü|u)', $rx);
		$rx = str_replace('ű', '(ű|u)', $rx);
		$rx = str_replace('Á', '(Á|á|A|a)', $rx);
		$rx = str_replace('É', '(É|é|E|e)', $rx);
		$rx = str_replace('Í', '(Í|í|I|i)', $rx);
		$rx = str_replace('Ó', '(Ó|ó|O|o)', $rx);
		$rx = str_replace('Ö', '(Ö|ö|O|o)', $rx);
		$rx = str_replace('Ő', '(Ő|ő|O|o)', $rx);
		$rx = str_replace('Ú', '(Ú|ú|U|u)', $rx);
		$rx = str_replace('Ü', '(Ü|ü|U|u)', $rx);
		$rx = str_replace('Ű', '(Ű|ű|U|u)', $rx);

		// Make first letter case insensitive
		$first = substr($rx, 0, 1);
		if($first >= "A" && $first <= "Z") {
			$rx = "(".strtoupper($first)."|".strtolower($first).")".substr($rx, 1);
		}
		return $rx;
	}
}
$stdin = fopen('php://stdin', 'r');
$first = true;

$engnames = array();
$lists = array();

while(($line = fgets($stdin)) !== false) {
	// Skip file header
	if($first) { 
		$first = false; 
		continue; 
	}
	$parts = explode("|", $line);

	// Skip small local names
	$type = trim($parts[1]);
	if($type != "city" && $type != "town" && $type != "village") {
		continue;
	}

	$p = new Place(trim($parts[0]), $type, trim($parts[3]), trim($parts[4]));

	$engname = str_replace('á', 'a', $p->name);
	$engname = str_replace('é', 'e', $engname);
	$engname = str_replace('í', 'i', $engname);
	$engname = str_replace('ó', 'o', $engname);
	$engname = str_replace('ö', 'o', $engname);
	$engname = str_replace('ő', 'o', $engname);
	$engname = str_replace('ú', 'u', $engname);
	$engname = str_replace('ü', 'u', $engname);
	$engname = str_replace('ű', 'u', $engname);
	$engname = str_replace('Á', 'a', $engname);
	$engname = str_replace('É', 'e', $engname);
	$engname = str_replace('Í', 'i', $engname);
	$engname = str_replace('Ó', 'o', $engname);
	$engname = str_replace('Ö', 'o', $engname);
	$engname = str_replace('Ő', 'o', $engname);
	$engname = str_replace('Ú', 'u', $engname);
	$engname = str_replace('Ü', 'u', $engname);
	$engname = str_replace('Ű', 'u', $engname);
	$engname = strtolower($engname);

	if(!array_key_exists($engname, $engnames)) {
		$engnames[$engname] = $p;
	} else {
		//echo($p->name." conflicts with ".$engnames[$engname]->name."\n");
		// Result currently:
		// Kömlő conflicts with Komló
		// Kömörö conflicts with Komoró
	}

	// Two hardcoded based on above test code
	if($p->name == "Kömlő") {
		$rx = "(K|k)ömlő";
		$official = "kömlő";
	} else if($p->name == "Kömörö" || $p->name == "Kömörő") {
		$rx = "(K|k)ömör(ö|ő)";
		$official = "kömörő";
	} else {
		$rx = $p->getNameRegexp();
		$official = $engname;
	}

	// mod_rewrite rule with accent insensitive and first letter case insensitive
	echo "RewriteRule ^terkep\/$rx\/?$ \/?zoom=15\&lat=".$p->lat."\&lon=".$p->lon." [R]\n";

	$firstletter = substr($engname, 0, 1);

	if(!array_key_exists($firstletter, $lists)) {
		$lists[$firstletter] = array();
	}
	array_push($lists[$firstletter], "<li><a href=\"/terkep/$official\" title=\"".$p->name." térképe\" >".$p->name."</a></li>");
}
fclose($stdin);

// Generate HTML lists of cities
$template = file_get_contents("list_template.html");
//setlocale(LC_ALL, "hu_HU");
foreach($lists as $firstletter => $places) {
	sort($places); //, SORT_LOCALE_STRING);
	$out = str_replace("{list}", implode("\n", $places), $template);
	file_put_contents("terkep/$firstletter.shtml", $out);
}
$out = str_replace("{list}", "", $template);
file_put_contents("terkep/index.shtml", $out);
?>
