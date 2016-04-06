<?php

/* Autocomplete database functions */

/**
 * Maintains the MySQL database that contains street name index for autocomplete
 */
class StreetsDB 
{
	public $mydb; // Connection to MySQL autocomplete database

	function __construct() {
		require_once 'config/mysql.php';
		$this->mydb = connect_mysql();
	}

	function free() {
		$this->mydb->free();
	}

	/**
	 * Initializes the database for new data import.
	 * Deletes place-street associations, use before importing new data.
	 * Sets all cities as not processed.
	 */
	function clean_streets() {
		$this->mydb->exec("TRUNCATE TABLE placestreets"); // KILL data!
		$this->mydb->exec("UPDATE places SET processed = 0");
	}

	/**
	 * Sets a city as being processed, while importing 
	 * Can be used to manually identify non-processed, so deleted cities
	 */
	function set_city_processed($osm_id) {
		$res = $this->mydb->exec("UPDATE places SET processed=1 WHERE osm_id =".$this->mydb->quote($osm_id, 'integer'));
		if(is_a($res, 'MDB2_Error')) { echo "MYSQL INSERT ERROR IN set_city_processed: "; die($res->getMessage()); }
	}

	/**
	 * Inserts a new city and marks it being processed
	 */
	function create_city($city) {
		$sql = "INSERT INTO places (osm_id,name,lat,lon,processed,population) VALUES("
			.$this->mydb->quote($city->osm_id, "integer").","
			.$this->mydb->quote($city->name, "text").","
			.$this->mydb->quote($city->lat, "float").","
			.$this->mydb->quote($city->lon, "float").",2,0)";
		$res = $this->mydb->exec($sql);
		if(is_a($res, 'MDB2_Error')) {
			// On unique constraint fail for osm_id or name
			if ($res->getCode() === -3) {
				echo $city->name . " has already been inserted. New osm id would have been: " . $city->osm_id . ". Skipping ";
			} else {
				echo "MYSQL INSERT ERROR IN create_city(" . $city->osm_id . "," . $city->name . "): "; die($res->getMessage());
			}
		}
	}

	/**
	 * Updates an existing city and marks it being processed
	 */
	function update_city($city) {
		$id = $this->mydb->quote($city->osm_id, "integer");
		$name = $this->mydb->quote($city->name, "text");
		$lat = $this->mydb->quote($city->lat, "float");
		$lon = $this->mydb->quote($city->lon, "float");

		$sql = "UPDATE places SET "
			. "name=" . $name
			. ",lat=" . $lat
			. ",lon=" . $lon
			. ",processed=2"
			. " WHERE osm_id=" . $id
			. " AND (name!=" . $name . " OR lat!=" . $lat . " OR lon!=" . $lon . ")";
		$res = $this->mydb->exec($sql);

		if(is_a($res, 'MDB2_Error')) {
			echo "MYSQL UPDATE ERROR IN update_city with sql: " . $sql . ": ";
			die($res->getMessage());
		}
	}

	function change_city_id($oldCity, $newCity) {
		$oldId = $this->mydb->quote($oldCity->osm_id, "integer");
		$newId = $this->mydb->quote($newCity->osm_id, "integer");
		$city = $newCity->name;

		$sql = "UPDATE places SET osm_id=" . $newId . " WHERE osm_id=" . $oldId;
		$res = $this->mydb->exec($sql);

		if(is_a($res, 'MDB2_Error')) {
			echo "MYSQL UPDATE ERROR IN change_city_id with sql: " . $sql . ": ";
			die($res->getMessage());
		}

		echo $res . " row updated in `places` from " . $oldId . " to " . $newId . "\n";
	}


	/**
	 * Load cities already imported into our database
	 *
	 * @param $letter string Starting letter of cities to load, when paging. Loads all if empty.
	 * @param $loadtags bool Whether to load tags of the cities 
	 * @returns Array of City objects extended with "tags" array.
	 */
	function load_cities($letter = "", $loadtags = false) {
		$ret = array();
		// Load places starting with a letter
		$where = "";
		if($letter) {
			if($letter == "o") {
				$where = " WHERE (places.name LIKE 'o%' OR places.name LIKE 'ö%' OR places.name LIKE 'ő%')";
			} else if($letter == "u") {
				$where = " WHERE (places.name LIKE 'u%' OR places.name LIKE 'ú%' OR places.name LIKE 'ű%')";
			} else {
				$where = " WHERE places.name LIKE '$letter%' ";
			}
		}
		$tags_join = "";
		$tags_cols = "";
		if($loadtags) {
			$tags_join = " LEFT JOIN placetags ON places.osm_id = placetags.place_id "
				."LEFT JOIN tags on placetags.tag_id = tags.id ";
			$tags_cols = ", placetags.date as keydate, tags.name as keyname, tags.value as keyvalue, tags.id as keyid ";
		}
		$sql = "SELECT places.osm_id, places.name, places.lat, places.lat, places.lon $tags_cols FROM places $tags_join $where ORDER BY places.name";
		$sth = $this->mydb->query($sql);

		if (is_a($sth, 'MDB2_Error')) { echo "QUERY ERROR:"; die($sth->getMessage()); }

		$lastid = 0;
		$city = null;
		while(($row = $sth->fetchRow(MDB2_FETCHMODE_ASSOC))) {
			if($lastid != $row["osm_id"]) {
				if($city) { 
					array_push($ret, $city);
				}
				// New city, not key only
				$city = new City();
				$city->name = $row["name"]; 
				$city->osm_id = $row["osm_id"];
				$city->lat = $row["lat"];
				$city->lon = $row["lon"];
				$lastid = $row["osm_id"];
			}
			// Add tags if any (repeated cities may occur)
			if(array_key_exists('keyname', $row) && $row['keyname']) {
				if(!isset($city->tags)) {
					$city->tags = array();
				}
				$tag = array(
					'id' => $row["keyid"], 
					'name' => $row["keyname"], 
					'value' => $row["keyvalue"], 
					'date' => $row["keydate"]);
				array_push($city->tags, $tag);
			}
		}
		if($city) {
			array_push($ret, $city);
		}
		$sth->free();
		return $ret;
	}

	/**
	 * Loads street names that are already imported to our database
	 *
	 * @returns array key=street name, value=local ID
	 */
	function load_streetnames() {

		$res = array();
		$sth = $this->mydb->query("select id,name from streetnames");
		
		if (is_a($sth, 'MDB2_Error')) { echo "QUERY ERROR:"; die($sth->getMessage()); }

		while (($row = $sth->fetchRow(MDB2_FETCHMODE_ASSOC))) {
			$res[$row["name"]] = $row["id"];
		}
		$sth->free();
		return $res;
	}

	/**
	 * Inserts a new street name to the database. Names must be unique.
	 *
	 * @returns int ID of the new street name
	 */
	function create_streetname($name) {
		$this->mydb->exec("INSERT INTO streetnames (name) VALUES (".$this->mydb->quote($name, 'text').")");
		return $this->mydb->lastInsertID();
	}

	/**
	 * Assigns a section of a street (osm way) to a city
	 */
	function assign_street_way($osm_id, $place_id, $streetname_id) {
		$this->mydb->exec("INSERT INTO placestreets (osm_id,place_id,streetname_id) VALUES ("
			.$this->mydb->quote($osm_id, 'integer').","
			.$this->mydb->quote($place_id, 'integer').","
			.$this->mydb->quote($streetname_id, 'integer').")");
	}

	/**
	 * Copies all content of "name" to "name_case", which is a binary column for Case Senstive match.
	 */
	function copy_names_case() {
		$this->mydb->exec("UPDATE streetnames SET name_case = name");
	}

	/**
	 * Delete names that don't anymore belong to anything - at end of a new import
	 */
	function delete_unused_names() {
		$this->mydb->exec("DELETE streetnames.* FROM streetnames LEFT JOIN placestreets ON streetnames.id = placestreets.streetname_id WHERE placestreets.streetname_id IS NULL");
	}

	/**
	 * Adds a tag to a city
	 */
	function add_tag($place_id, $tag_id) {
		$this->mydb->exec("INSERT INTO placetags (place_id,tag_id) VALUES ("
			.$this->mydb->quote($place_id, 'integer').","
			.$this->mydb->quote($tag_id, 'integer').")");
	}
}

/* PostGIS Db function */

class GisDB
{
	public $gis; // Connection

	function __construct() {
		require_once 'config/pgsql.php';
		$this->gis = connect_pgsql();
	}

	function free() {
		$this->gis->free();
	}

	// Load city "place" nodes from OSM database
	// returns array: key=place name, value=City data
	function load_cities() {
		$centers = array();
		$sth = $this->gis->query("select osm_id,name, ST_X(ST_Transform(way,4326)) as lon, ST_Y(ST_Transform(way,4326)) as lat FROM planet_osm_point WHERE place IN('city','town','village') AND name != 'Budapest'");
		
		if (is_a($sth, 'MDB2_Error')) { echo "QUERY ERROR:"; die($sth->getMessage()); }

		while (($row = $sth->fetchRow(MDB2_FETCHMODE_ASSOC))) {
			if(array_key_exists($row['name'], $centers)) {
				die("Duplicated city place: ".$row["name"]." Node IDs: ".$row["osm_id"].",".$centers[$row["name"]].".\n");
			}
			$city = new City();
			$city->name = $row["name"];
			$city->osm_id = $row["osm_id"];
			$city->lat = $row["lat"];
			$city->lon = $row["lon"];
			$centers[$row["name"]] = $city;
		}
		$sth->free();
		return $centers;
	}

	function get_boundary_iterator() {
		return new BoundaryIterator($this->gis);
	}
}

/**
 * Iterates admin level boundaries that we import
 */
class BoundaryIterator implements Iterator {

	private $gis;

	// These are in hungary.osm Geofabrik, but not inside Hungary
	private $foreign = array(-1676393, -177041, -1676391, -109713, -1676395,
		-190387, -109544, -109315, -109523, -109111, -109536, 30697601, -2386304,
		-2384737, -2384684, -2274820, -2274801, -2274781, -2274732, -2273310, -2218893,
		26037728, 337605191, 337658063, 337658973, 337658185, 337658533, 337658671,
		337658962, 337659430, 337659585);
	private $sth;  // Statement handle that loads the records // FIXME: need to close somehow!
	private $curr; // Current item in recordset

	function __construct($dbconn) {
		$this->gis = $dbconn;
	}

	private function start() {
		//echo("Start");
		// Get place boundaries from PostGIS (except Budapest)
		$this->sth = $this->gis->query("SELECT osm_id,name,ST_X(ST_Transform(ST_Centroid(way), 4326)) as boundlon, ST_Y(ST_Transform(ST_Centroid(way), 4326)) as boundlat FROM planet_osm_polygon WHERE boundary = 'administrative' AND admin_level IN ('8','9') AND name != 'Budapest' ORDER BY name");
		if (is_a($this->sth, 'MDB2_Error')) { echo "QUERY ERROR:"; die($this->sth->getMessage()); }
		$this->fetch();
	}

	private function fetch() {
		do {
			$this->curr = $this->sth->fetchRow(MDB2_FETCHMODE_ASSOC);
		} while($this->curr && in_array($this->curr["osm_id"], $this->foreign)); // Skip foreign cities
	}

	function rewind() {
		//echo("rewind");
		if($this->curr) {
			$this->sth->free();
		}
		$this->start();
	}

	function current() {
		return $this->curr;
	}

	function key() {
		return $this->curr["osm_id"];
	}

	function next() {
		$this->fetch();
		return $this->curr;
	}

	function valid() {
		//echo("valid:" . ($this->curr != null));
		return ($this->curr != null);
	}

	function free() {
		$this->sth->free();
		$this->curr = null;
	}
}

/**
 * Represents basic city data 
 */
class City {
	public $osm_id;
	public $name;
	public $lat;
	public $lon;

	public function __toString() {
		return $this->name;
	}
}
?>
