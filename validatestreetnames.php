<?php
	require_once 'config/mysql.php';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="hu" lang="hu" >

<head>
	<title>Utca keresés az adatbázisban</title>

	<?php include 'includes/head_scripts.html' ?>
</head>
<body class="info">
<?php include 'includes/header.html' ?>

<div id="jobbd">
<div id="jszd">

<h1>Nevek megjelölése jónak a helyi adatbázisban</h1>
<p>Figyelem: Amit megjelölsz, azt soha többé nem fogjuk látni ezen a listán! Rosszat ne jelölj meg: javísd az OSM-ben és majd frissítés után eltűnik!</p>
<p>Figyelem: dologzz egy találomra választott oldalon, hátha más is ugyanazt csinálja.</p>

<p><a href="validatestreetnames.php?mode=u">.u keresés</a> |
<a href="validatestreetnames.php?mode=all">ellenőrzendők keresése</a> |
<a href="validatestreetnames.php?mode=diktator">diktátor keresés</a> |
<a href="validatestreetnames.php?mode=latin1">őű hibák</a> |
<a href="validatestreetnames.php?mode=spell">input box spellcheck</a> |
<a href="validatestreetnames.php?action=authorize">belépés</a>
</p>
<?php

// Read Query String parameters
$page = 0;
if(array_key_exists("page", $_GET)) {
	$page = intval($_GET["page"]);
}
$mode = "all";
if(array_key_exists("mode", $_GET) 
	&& in_array($_GET["mode"], array("u", "diktator", "latin1", "spell"))) {
	
	$mode = $_GET["mode"];
}

$db = connect_mysql();

// Process submit
if(false && array_key_exists("storevalidate", $_POST)) {

	$store_sth = $db->prepare("UPDATE streetnames SET validated = 1 WHERE id=?", array('integer'), MDB2_PREPARE_MANIP);
	if (is_a($store_sth, 'MDB2_Error')) { echo "STORE ERROR:"; die($sth->getMessage()); }

	foreach($_POST as $key => $value) {
		if(strpos($key, "chk_") === 0) {
			$id = intval(substr($key, 4));
			$store_sth->execute($id);
			echo("Saved $id as OK.<br>");
		}
	}
	$store_sth->free();
}


$where = "";
if($mode == "u") {
	$where = " AND ("
		."name LIKE '%u.%' OR "
		."name LIKE '%ú.%' OR "
		."name_case LIKE '% Utca%' OR "
		."name_case LIKE '% Tér%' OR "
		."name_case LIKE '% Út%')"; 
} else if($mode == "latin1") {
	$where = " AND ("
		."name_case LIKE '%ô%' OR "
		."name_case LIKE '%õ%' OR "
		."name_case LIKE '%û%' OR "
		."name_case LIKE '%ũ%' OR "
		."name_case LIKE '%Ô%' OR "
		."name_case LIKE '%Õ%' OR "
		."name_case LIKE '%Û%' OR "
		."name_case LIKE '%Ũ%')";
} else if($mode == "diktator") {
    // http://mta.hu/data/cikk/13/13/63/cikk_131363/Onkenyuralmi_nevek_egyesitett_tabla.pdf
	$where = " AND ("
		."name LIKE 'Alpári Gyula%' OR "
		."name LIKE 'Április 4%' OR "
		."name LIKE 'Asztalos János%' OR "
		."name LIKE 'Bernáth Lajos%' OR "
		."name LIKE 'Bokányi Dezső%' OR "
		."name LIKE 'Bundzsák István%' OR "
		."name LIKE 'Császy László%' OR "
		."name LIKE 'Darvas József%' OR "
		."name LIKE 'Demény Rezső%' OR "
		."name LIKE 'Dimitrov%' OR "
		."name LIKE 'Dobi István%' OR "
		."name LIKE 'Erdei Ferenc%' OR "
		."name LIKE 'Élmunkás%' OR "
		."name LIKE 'Fazekas Gábor%' OR "
		."name LIKE 'Felszabadítók%' OR "
		."name LIKE 'Felszabadulás%' OR "
		."name LIKE 'Fürst Sándor%' OR "
		."name LIKE 'Garbai Sándor%' OR "
		."name LIKE 'Gorkij%' OR "
		."name LIKE 'Hámán Kató%' OR "
		."name LIKE 'Huszti Ferenc%' OR "
		."name LIKE 'Ifjúmunkás%' OR "
		."name LIKE 'Kállai Éva%' OR "
		."name LIKE 'Karikás Frigyes%' OR "
		."name LIKE 'Károlyi Miháy%' OR "
		."name LIKE 'Kilián György%' OR "
		."name LIKE 'Kisdobos%' OR "
		."name LIKE 'Kocsis Lajos%' OR "
		."name LIKE 'Kókai László%' OR "
		."name LIKE 'Korvin Ottó%' OR "
		."name LIKE 'Corvin Ottó%' OR "
		."name LIKE 'Kovács Sándor%' OR "
		."name LIKE 'Kun Béla%' OR "
		."name LIKE 'Landrer Jenő%' OR "
		."name LIKE 'Lenin%' OR "
		."name LIKE 'Lukács György%' OR "
		."name LIKE 'Majakovszkij%' OR "
		."name LIKE 'Marx%' OR "
		."name LIKE 'Matuzsa György%' OR "
		."name LIKE 'Máté János%' OR "
		."name LIKE 'Mező Imre%' OR "
		."name LIKE 'Micsurin%' OR "
		."name LIKE 'Mosolygó Antal%' OR "
		."name LIKE 'Münnich Ferenc%' OR "
		."name LIKE 'Népfront%' OR "
		."name LIKE 'Néphadsereg%' OR "
		."name LIKE 'Nógrádi Sándor%' OR "
		."name LIKE 'Oprendek Sándor%' OR "
		."name LIKE 'Partizán%' OR "
		."name LIKE 'Pálfi Ernő%' OR "
		."name LIKE 'Rajk%' OR "
		."name LIKE 'Révai József%' OR "
		."name LIKE 'Rosenberg%' OR "
		."name LIKE 'Rózsa Ferenc%' OR "
		."name LIKE 'Rudas László%' OR "
		."name LIKE 'Sallai%' OR "
		."name LIKE 'Ságvári Endre%' OR "
		."name LIKE 'Schönherz Zoltán%' OR "
		."name LIKE 'Szabó Erzsébet%' OR "
		."name LIKE 'Sziklai Sándor%' OR "
		."name LIKE 'Szűcs József%' OR "
		."name LIKE 'Tanács%' OR "
		."name LIKE 'Takács György%' OR "
		."name LIKE 'Tolbuhin%' OR "
		."name LIKE 'Úttörő%' OR "
		."name LIKE 'Vörös csillag%' OR "
		."name LIKE 'Vöröscsillag%' OR "
		."name LIKE 'Vörös hadsereg%' OR "
		."name LIKE 'Vörös hajnal%' OR "
		."name LIKE 'Wiedemann Antal%' OR "
		."name LIKE 'Zalka Máté%' OR "
		."name LIKE 'Zója%' OR "
	// http://zsakutca.iksz.net/page.php?20
		."name LIKE 'Szamuely Tibor%' OR "
		."name LIKE 'Munkásőr%' OR "
		."name LIKE 'Tanácsköztársaság%' OR "
		."name LIKE 'Népköztársaság%' OR "
		."name LIKE 'Frankel Leó%' OR "
		."name LIKE 'November 7%' OR "
		."name LIKE 'Engels%' "
	.")"; }

echo("<!-- $where -->");
// Count items for pager
$count_sth = $db->query("SELECT count(*) as count FROM streetnames WHERE validated = 0 $where");
if (is_a($count_sth, 'MDB2_Error')) { echo "QUERY ERROR:"; die($count_sth->getMessage()); }
$row = $count_sth->fetchRow(MDB2_FETCHMODE_ASSOC);
$count = $row["count"];
$count_sth->free();
echo("<p>");
for($i = 0; $i * 100 < $count; $i += 1) {
	if($page == $i) {
		echo("<strong>$i</strong> | ");
	} else {
		echo("<a href=\"validatestreetnames.php?mode=$mode&page=$i\">$i</a> | ");
	}
}
echo("</p>");

// Load street names 
$sth = $db->query("SELECT id,name FROM streetnames WHERE validated = 0 $where ORDER BY name LIMIT ".$page."00,100");
if (is_a($sth, 'MDB2_Error')) { echo "QUERY ERROR:"; die($sth->getMessage()); }

?>
<form action="validatestreetnames.php?mode=<?php echo($mode) ?>&page=<?php echo($page); ?>" method="post">
<?php

while(($row = $sth->fetchRow(MDB2_FETCHMODE_ASSOC))) {
	echo("<label><input type=\"checkbox\" name=\"chk_".$row["id"]."\">");
	if($mode == "spell") {
		echo("</label><input type=\"text\" spellcheck=\"true\" value=\"".htmlspecialchars($row["name"])."\" style=\"width: 90%\">");
	} else {
		echo($row["name"]."</label>");
	}
	echo(" <a href=\"validatestreetfind.php?id=".$row["id"]."\">?</a><br>\n");
}
$sth->free();
$db->free();
?>
<input type="submit" name="storevalidate" value="A megjelölt nevek jók" disabled="disabled">
</form>
<?php
if($page < $count) {
	echo("<a href=\"validatestreetnames.php?mode=$mode&page=".($page+1)."\">Következő</a> ");
}
?>
</div>
</div>
</div>
</body>
</html>

