<?php
if(empty($argc)) {
	echo("nem webes");
	exit;
}
include dirname(__FILE__) . '/../lib.php';
/*

FIXME: DELETE command needed for the tables that are not killed!!!
E.g. if a streetname is not used anylonger, it has to be deleted at the end.

 -----------------------
 This script connects to both PostGIS and MySQL and copies streets 
 indexed by "in which city this street is" for fast lookup in street autocomplete.
 -----------------------

 Updating PostGIS database
	https://download.geofabrik.de/europe/hungary.html
	osm2pgsql -d gis -U gis -W -H localhost --slim -m hungary-latest.osm.pbf

 Streets database (MySQL)
  "places" table: contains the "place" nodes from OSM which are place="city" "town" or "village"

    osm_id: OSM node id of the node
	name: name
	parent_id: unused, I forogt
	processed: set to "0" at start, then updated to '1' for reused lines, '2' for newly inserted lines

  "streetnames" table: contains a list of all unquie street names that are found in loading highways

    id: local database row id
	name: string from the street name
	validated: there is a GUI to mark streets as cool

  "placestreets" table: connects "places" and "streetnames", but every entry appears as many
    times as many different sections of that way has in the geographical data

	osm_id: OSM id of this section of the street
	place_id: refers to places.id
	streetname_id: refers to stretnames.id

*/
// "$mysqldb" is the MySQL database - target database
$mysqldb = new StreetsDB();
$mysqldb->clean_streets();

// "$gisdb" is the OSM database loaded with osm2pgsql
$gisdb = new GisDB();

// Load "place" nodes PostGIS to hashtable (key: city name, value: osm_id)
$osm_centers = $gisdb->load_cities();
echo("Loaded ".count($osm_centers)." OSM cities.\n");
$str_cities = $mysqldb->load_cities();
echo("Loaded ".count($str_cities)." already imported cities.\n");
$my_streets = $mysqldb->load_streetnames();
echo("Loaded ".count($my_streets)." already imported streets.\n");
$bounds = $gisdb->get_boundary_iterator();

// Loop admin boundaries (plc is an SQL sth with "name" and "osm_id")
foreach($bounds as $plc) {
	// Copy either boundary or pre-loaded GIS city data to a new object
	$newcity = new City();
	// Budapest distincts are handled separately and renamed
	if(preg_match("/[XIV]+\. kerület/", $plc['name'])) {
		// Rename "II. kerület" -> "Budapest II."
		$newcity->name = preg_replace("/([XIV]+\.) kerület/", "Budapest $1", $plc['name']);
		$newcity->osm_id = $plc["osm_id"];
		// FIXME: distincts are not loaded to osm_centers so we use boundary geometry center
		$newcity->lat = $plc["boundlat"];
		$newcity->lon = $plc["boundlon"];
	} else {
		$newcity->name = $plc['name']; // Non-budapest, keep name
		// Full-data loaded from GIS city list?
		if(!array_key_exists($newcity->name, $osm_centers)) {
			// These are foreign cities usually
			echo("No center loaded for ".$newcity->name." (".$plc["osm_id"].")\n");
			$newcity->osm_id = $plc["osm_id"];
		} else {
			$newcity->osm_id = $osm_centers[$plc['name']]->osm_id;
			$newcity->lat = $osm_centers[$plc['name']]->lat;
			$newcity->lon = $osm_centers[$plc['name']]->lon;
		}
	}

	// "Place" already copied? (find by name)
	$c = find_imported_city($newcity->name, $str_cities);
	if($c) {
		if($c->osm_id != $newcity->osm_id) {
			echo "Updating OSM ID for " . $newcity->name . "\n";
			$mysqldb->change_city_id($c, $newcity);
		}
		// Already imported city, keep and update (by id)
		$mysqldb->update_city($newcity);
	} else {
		$mysqldb->create_city($newcity);
	}
	echo($newcity->name."\n");

//continue; // Armed/unarmed?
	// Get streets of this place
	//$sth = $gis->query("select name, osm_id from planet_osm_line where highway != '' and name != '' and ".
	//	"st_within(way, (select way from planet_osm_polygon where boundary='administrative' and name=".$gis->quote($plc['name'], 'text')." LIMIT 1))",
	//	array('text'));
	$query = "SELECT ways.name as name,ways.osm_id as osm_id "
	       . "FROM planet_osm_line ways, planet_osm_polygon polys "
	       . "WHERE ST_Contains(polys.way, ways.way) "
	       . "AND ways.highway != '' AND ways.name != ''"
	       . "AND polys.admin_level IN('8','9') "
	       . "AND polys.name = :name";
	try {
		$stmt = $gisdb->gis->prepare($query);
		$stmt->execute(array(
			":name" => $plc['name']
		));
	} catch (PDOException $e) {
		echo 'Postgresql error in city import: ' . $e->getMessage();
		die();
	}
	while ($street = $stmt->fetch()) {
		if (!array_key_exists($street['name'], $my_streets)) {
			$newId = $mysqldb->create_streetname($street['name']);
			$my_streets[$street['name']] = $newId;
		}
		$mysqldb->assign_street_way($street['osm_id'], $newcity->osm_id, $my_streets[$street['name']]);
	}
}
$mysqldb->copy_names_case();
$mysqldb->delete_unused_names();

function find_imported_city($name, $list) {
	for($i = 0; $i < count($list); $i++) {
		if($list[$i]->name == $name) { return $list[$i]; }
	}
	return null;
}
?>
