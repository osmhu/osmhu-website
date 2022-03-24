<?php include 'includes/top.html'; ?>
	<title>Utca keresés a helyi adatbázisban</title>

	<?php include 'includes/head_scripts.html' ?>
</head>
<body class="info-page">
	<?php include 'includes/header.html' ?>

	<div class="page-navigation">
		<ul class="submenu">
			<li><a href="validatestreetnames.php?mode=u">.u keresés</a></li>
			<li><a href="validatestreetnames.php?mode=all">ellenőrzendők keresése</a></li>
			<li><a href="validatestreetnames.php?mode=diktator">diktátor keresés</a></li>
			<li><a href="validatestreetnames.php?mode=latin1">őű hibák</a></li>
			<li><a href="validatestreetnames.php?mode=spell">input box spellcheck</a></li>
			<li><a href="validatestreetnames.php?action=authorize">belépés</a></li>
		</ul>
	</div>

	<div class="page-content">
		<h1>Nevek megjelölése jónak a helyi adatbázisban</h1>
		<p>Figyelem: Amit megjelölsz, azt soha többé nem fogjuk látni ezen a listán!</p>
		<p>Rosszat ne jelölj meg: javítsd az OSM-ben és majd frissítés után eltűnik!</p>
		<p>Tipp: dolgozz egy találomra választott oldalon, hátha más is ugyanazt csinálja.</p>
<?php
require_once dirname(__FILE__) . '/config/mysql.php';

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

// Process submit
if(false && array_key_exists("storevalidate", $_POST)) {

	$stmt = $db->prepare('UPDATE streetnames SET validated = 1 WHERE id = :id');
	foreach($_POST as $key => $value) {
		if(strpos($key, "chk_") === 0) {
			$id = intval(substr($key, 4));
			$stmt->execute(array(
				':id' => $id
			));
			echo("Saved $id as OK.<br>");
		}
	}
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
    // https://2015-2019.kormany.hu/download/c/fc/f0000/Onkenyuralmi_nevek_egyesitett_tabla-MTA_%C3%A1ll%C3%A1sfoglal%C3%A1sa.pdf
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
try {
	$stmt = $db->prepare('SELECT count(*) as count FROM streetnames WHERE validated = 0 ' . $where);
	$count_sth = $stmt->execute();
	$row = $stmt->fetch();
	$count = $row['count'];
} catch (PDOException $e) {
	echo 'MySQL COUNT error in validatestreetnames: ' . $e->getMessage();
	die();
}

echo("<p>");
for($i = 0; $i * 100 < $count; $i += 1) {
	if($page == $i) {
		echo("<strong>$i</strong> | ");
	} else {
		echo("<a href=\"validatestreetnames.php?mode=$mode&page=$i\">$i</a> | ");
	}
}
echo("</p>");

if ($count == 0) {
	die("<p><strong>Ebben a nézetben jelenleg nincs hiba!</strong></p>");
}

// Load street names
try {
	$streetsStmt = $db->prepare('SELECT id,name FROM streetnames WHERE validated = 0 ' . $where . ' ORDER BY name LIMIT '.$page.'00,100');
	$streetsStmt->execute();
} catch (PDOException $e) {
	echo 'MySQL SELECT error in validatestreetnames: ' . $e->getMessage();
	die();
}
?>
<form action="validatestreetnames.php?mode=<?php echo($mode) ?>&page=<?php echo($page); ?>" method="post">
	<table border='1'>
		<thead>
			<th>Jó</th>
			<th>Utca neve</th>
			<th>OSM objektumok</th>
		</thead>
		<tbody>
			<?php
			while ($street = $streetsStmt->fetch()) {
				$inputId = 'chk_' . $street['id'];
				$streetName = htmlspecialchars($street["name"]);
				echo '<tr>';
				echo '<td style="width: 24px; height: 22px; text-align: center">';
				echo '<input id="' . $inputId . '" type="checkbox" name="' . $inputId . '">';
				echo '</td><td style="min-width: 200px">';
				if ($mode == "spell") {
					echo '<input type="text" spellcheck="true" value="' . $streetName . '">';
				} else {
					echo '<label for="chk_' . $street['id'] . '">' . $streetName . '</label>';
				}
				echo '</td><td>';
				$streetPartStmt = $db->prepare('SELECT osm_id FROM placestreets WHERE streetname_id = :id');
				$streetPartStmt->execute(array(
					':id' => $street['id']
				));
				$i = 0;
				while ($streetPart = $streetPartStmt->fetch()) {
					if ($i > 0) {
						echo ', ';
					} else {
						$i++;
					}
					echo '<a href="https://www.openstreetmap.org/browse/way/' . $streetPart['osm_id'].'" target="_blank">';
					echo $streetPart['osm_id'] . '</a>';
				}
				echo '</tr>';
			}
			?>
		</tbody>
	</table>
	<br />
	<input type="submit" name="storevalidate" value="A megjelölt nevek jók">
</form>
<br />
<?php
if (($page + 1) * 100 < $count) {
	echo("<a href=\"validatestreetnames.php?mode=$mode&page=" . ($page + 1) . "\">Következő</a> ");
}
?>
</div>
</body>
</html>

