<?php include 'includes/top.html' ?>
	<title>Magyarországi városok és falvak térképe</title>

	<?php include 'includes/head_scripts.html' ?>
	<link rel="stylesheet" href="/css/info.css?rev=415">
	<script src="//code.jquery.com/jquery-3.6.0.min.js"></script>
	<script>
		var overpassUrl = 'https://lz4.overpass-api.de/api/interpreter';
		var keepRightUrlTemplate = 'https://keepright.at/report_map.php?zoom=13&lat={lat}&lon={lon}'
			+ '&layers=B0T&ch=0%2C30%2C40%2C50%2C70%2C90%2C120%2C130%2C150%2C160%2C170%2C180%2C191%2C194%2C195%2C196'
			+ '%2C201%2C202%2C203%2C204%2C205%2C206%2C207%2C208%2C210%2C220%2C231%2C232%2C270%2C281%2C282%2C283%2C284'
			+ '%2C285%2C291%2C292%2C293%2C294%2C311%2C312%2C313%2C320%2C350%2C370%2C380%2C401%2C402%2C411%2C412%2C413'
			+ '&show_ign=1&show_tmpign=1';
		// var bingCompareUrlTemplate = 'https://tools.geofabrik.de/mc/?mt0=mapnik&mt1=bingsat&lon={lon}&lat={lat}&zoom=16';
		var bingCompareUrlTemplate = 'https://mc.bbbike.org/mc/?lon={lon}&lat={lat}&zoom=16&num=2'
			+ '&mt0=mapnik&mt1=bing-satellite';

		function openKeepRight(placeId) {
			openToolInNewWindow(placeId, keepRightUrlTemplate);
		}

		function openBingCompare(placeId) {
			openToolInNewWindow(placeId, bingCompareUrlTemplate);
		}

		function openToolInNewWindow(placeId, toolUrlTemplate) {
			getSingleNode(placeId, function(osmElement) {
				var toolUrl = toolUrlTemplate
					.replace('{lat}', osmElement.lat)
					.replace('{lon}', osmElement.lon);

				var newWindow = window.open(toolUrl, '_blank');
				if (newWindow != null) {
					newWindow.focus();
				}
			});
		}

		function getSingleNode(nodeId, callback) {
			var data = {
				data: '[out:json];node(' + nodeId + ');out body;'
			};

			$.get(overpassUrl, data, function(response) {
				if (response.elements.length == 1) {
					callback(response.elements[0]);
				} else {
					console.error('Overpass returned ' + response.elements.length + ' elements for this node id: ' + nodeId);
				}
			});
		}

		function highlight(node, type) {
			if (type == 'p') {
				$(node).parent().addClass('highlight');
			} else if (type == 'pp') {
				$(node).parent().parent().addClass('highlight');
			} else {
				$(node).addClass('highlight');
			}
		}

		function changeTool(selectHtmlElement) {
			var tool = selectHtmlElement[selectHtmlElement.selectedIndex].value;
			var url = '/terkep/';
			if (page) {
				url += page;
			}
			if (tool) {
				url += '?tool=' + tool;
			}
			document.location.href = url;
		}
	</script>
</head>
<body class="info-page citylist">
	<?php include 'includes/header.html' ?>

	<div class="page-navigation active-terkep">
		<?php include 'includes/submenu.html' ?>
	</div>

	<div class="page-content">
		<h1>Település térkép gyorslinkek</h1>

		<p>A városok, községek és falvak térképeire mutató gyorslinkek másolásával,
		könnyen olvasható és begépelhető formában küldheted a térképet ismerőseinek.</p>
		<p>Például: <strong>www.openstreetmap.hu/terkep/godollo</strong> (ékezetekkel is működik)</p>
		<p>Használd a jobb-gomb, "Link címének másolása" menüpontot a böngészőben.</p>

		<hr />

<?php
include 'lib.php';

// These are valid in "page=" query string
$letters = array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
	"k", "l", "m", "n", "o", "p", "r", "s", "t", "u", "v", "z", "*");
$pagenames = array("A,Á", "B", "C,Cs", "D", "E,É", "F", "G,Gy", "H", "I,Í", "J",
	"K", "L", "M", "N,Ny", "O,Ó,Ö,Ő", "P", "R", "S,Sz", "T,Ty", "U,Ú,Ü,Ű", "V", "Z,Zs", "Mind");
// Letter replace for accent-less short URL display
$hutrans = array(
	"á" => "a", "é" => "e", "í" => "i",
	"ó" => "o", "ö" => "o", "ő" => "o",
	"ú" => "u", "ü" => "u", "ű" => "u",
	"Á" => "a", "É" => "e", "Í" => "i",
	"Ó" => "o", "Ö" => "o", "Ő" => "o",
	"Ú" => "u", "Ü" => "u", "Ű" => "u"
	);
$tools = array('keepright', 'bingcompare');

// Read Query String parameters
$page = "";
if(array_key_exists("page", $_GET) && in_array($_GET["page"], $letters)) {
	$page = $_GET["page"];
}
$tool = "";
if(array_key_exists("tool", $_GET) && in_array($_GET["tool"], $tools)) {
	$tool = $_GET["tool"];
}
$place = "";
if(array_key_exists("place", $_GET)) {
	$mode = "place";
}

$strdb = new StreetsDB();

/*
// Process tag submit
if(array_key_exists("tagsubmit", $_POST)) {
	foreach($_POST as $key => $value) {
		if(preg_match("/^street_\d*$/", $key)) {
			$id = str_replace("street_", "", $key);
			$strdb->add_tag($id, 3);
		} else if(preg_match("/^bing_\d*$/", $key)) {
			$id = str_replace("bing_", "", $key);
			$strdb->add_tag($id, 4);
		}
	}
}
*/

// Show header and letters
$formaction = "/terkep/$page" . ($tool != "" ? "?tool=$tool" : "");
echo("<h1>Magyarországi városok és falvak térképe</h1>\n");
//echo("<form action=\"$formaction\" method=\"post\">");
showPageLetters($letters, $pagenames, $page, $tool);
showTools($tool);

if ($tool == 'keepright') {
	echo '<p>A KeepRight használatához engedélyezd a felugró ablakokat, majd kattints a hivatkozásokra.</p>';
} else if ($tool == 'bingcompare') {
	echo '<p>A Bing összehasonlító nézet használatához engedélyezd a felugró ablakokat, majd kattints a hivatkozásokra.</p>';
}

// Show city list
if($page) {
	$list = $strdb->load_cities(($page == "*" ? "" : $page), $tool == "tags");
	echo("<table class=\"citylist-table $tool\">\n");
	foreach($list as $city) {
		if($city->name != "Kömörő") { // Conflicts with Komoró
			$city_lc = strtolower(strtr($city->name, $hutrans));
		} else {
			$city_lc = "kömörő";
		}
		if(strpos($city_lc, 'budapest') === 0) {
			if($city_lc != "budapest i.") {
				continue;
			}
			$city->name = "Budapest"; // Fake budapest
			$city->osm_id = 85788293;
			$city_lc = "budapest";
		}

		// Show friendly URL to city
		echo("<tr>");
		echo("<td><a href=\"/terkep/$city_lc\">".$city->name."</a></td>");

		// Show selected tool
		if($tool == "keepright") {
			echo("<td><a href=\"javascript:openKeepRight(".$city->osm_id.");\" onclick=\"highlight(this, 'pp');\">KeepRight</a></td>");
		} else if($tool == "tags") {
			echo("<td>");
			$tagids = array();
			if(isset($city->tags)) {
				$tagids = showTags($city->tags);
			}
			//echo("<a href=\"javascript:tagedit(".$city->osm_id.");\">tags<a>");
		/*	if(!in_array(3, $tagids)) {
				echo("<input type=\"checkbox\" name=\"street_".$city->osm_id."\"> utcanevek kell");
			}
			if(!in_array(4, $tagids)) {
				echo("<input type=\"checkbox\" name=\"bing_".$city->osm_id."\"> bingezni kell");
			}*/
			echo("</td>");
		} else if($tool == "bingcompare") {
			echo("<td><a href=\"javascript:openBingCompare(".$city->osm_id.");\" onclick=\"highlight(this, 'pp');\">Bing</a></td>");
		} else {
			echo("<td>https://www.openstreetmap.hu/terkep/$city_lc</td>");
		}
		echo("</tr>\n");
	}
	echo("</table>\n");
}


if($page) {
	showPageLetters($letters, $pagenames, $page, $tool);
}
//echo("<input type=\"submit\" name=\"tagsubmit\"></form>");

// Shows tags and returns a simple array of IDs for have/nothave checks
function showTags($tags) {
	$ids = array();
	foreach($tags as $tag) {
		if(count($ids) > 0) { echo("<br>"); }
		echo("<strong>".$tag["name"]."</strong> = ".$tag["value"]." <span class=\"date\">(".$tag["date"].")</span>\n");
		array_push($ids, $tag["id"]);
	}
	return $ids;
}

function showPageLetters($letters, $pagenames, $page, $tool) {

	if($tool) { $tool = "?tool=".$tool; }

	echo("<p>");
	for($i = 0; $i < count($letters); $i++) {
		if($i > 0) { echo(" | "); }
		if($page == $letters[$i]) {
			echo("<strong>".$pagenames[$i]."</strong>");
		} else {
			echo("<a href=\"/terkep/".$letters[$i].$tool."\">".$pagenames[$i]."</a>");
		}
	}
	echo("</p>");
	echo("\n<script>\nvar page='$page';\n</script>\n");
}
function showTools($tool) {
?>
Segédeszköz:
<select onchange="changeTool(this);">
	<option value="">-</option>
	<option value="keepright" <?php sel($tool == "keepright") ?>>KeepRight</option>
	<option value="bingcompare" <?php sel($tool == "bingcompare") ?>>Bing műhold</option>
</select>
<?php
}
// Render selected="selected" if true
function sel($select) {
	if($select) { echo(" selected=\"selected\""); }
}
?>
	</div>
</body>
</html>
