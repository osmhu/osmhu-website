<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="hu" lang="hu" >

<head>
	<title>Utca keresés a helyi adatbázisban</title>

	<?php include 'includes/head_scripts.html' ?>
</head>
<body class="info">
<?php include 'includes/header.html' ?>

<div id="jobbd">
<div id="jszd">
<h1>Nevek megjelölése jónak a helyi adatbázisban</h1>

<?php

$id = 0;
if(array_key_exists("id", $_GET)) {
	$id = intval($_GET["id"]);
}
if($id <= 0) {
	echo("Need ID");
	die();
}

require_once 'config/mysql.php';

try {
	$stmt = $db->prepare('SELECT osm_id FROM placestreets WHERE streetname_id = :id');
	$stmt->execute(array(
		':id' => $id
	));
} catch (PDOException $e) {
	echo 'MySQL SELECT error in validatestreetfind: ' . $e->getMessage();
	die();
}

$wayids = "";
echo("<h2>Böngészés:</h2><p>");
while(($row = $stmt->fetch())) {
	if($wayids) { $wayids .= ","; }
	$wayids .= $row["osm_id"];
	echo("<a href=\"http://www.openstreetmap.org/browse/way/".$row["osm_id"]."\">".$row["osm_id"]."</a><br>\n");
}
echo("</p><h2>Way ID list: </h2><p>".$wayids."</p>");

?>

</div>
</div>
</div>
</body>
</html>

