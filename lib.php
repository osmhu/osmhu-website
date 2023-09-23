<?php

/* Autocomplete database functions */

class DuplicateCityException extends Exception
{
	private $cityName;
	private $alreadyLoadedNodeId;
	private $newNodeId;

	public function __construct($cityName, $alreadyLoadedNodeId, $newNodeId)
	{
		$this->cityName = $cityName;
		$this->alreadyLoadedNodeId = $alreadyLoadedNodeId;
		$this->newNodeId = $newNodeId;
		parent::__construct($this->getErrorMessage(), 0);
	}

	public function getErrorMessage()
	{
		$message = "#############################################\n";
		$message .= "# ERROR! Duplicated city place: " . $this->cityName . "\n";
		$message .= "#############################################\n";
		$message .= "Already loaded node id: " . $this->alreadyLoadedNodeId . " ";
		$message .= "[ https://www.openstreetmap.org/node/" . $this->alreadyLoadedNodeId . " ]\n";
		$message .= "Node ID: " . $this->newNodeId . " ";
		$message .= "[ https://www.openstreetmap.org/node/" . $this->newNodeId . " ]\n";
		$message .= "Recommended steps to fix the problem:\n";
		$message .= "1. Resolve the conflict in the global osm database\n";
		$message .= "2. Delete your local copy of the city you deleted in the global osm db\n";
		$message .= "   with ONE of the following commands:\n";
		$message .= "DELETE FROM planet_osm_point WHERE osm_id=" . $this->alreadyLoadedNodeId . ";\n";
		$message .= "DELETE FROM planet_osm_point WHERE osm_id=" . $this->newNodeId . ";\n";
		return $message;
	}

	public function __toString()
	{
		return $this->getErrorMessage();
	}
}

/**
 * Maintains the MySQL database that contains street name index for autocomplete
 */
class StreetsDB
{
	public $mydb; // Connection to MySQL autocomplete database

	public function __construct()
	{
		require_once dirname(__FILE__) . '/config/mysql.php';
		$this->mydb = $db;
	}

	/**
	 * Initializes the database for new data import.
	 * Deletes place-street associations, use before importing new data.
	 * Sets all cities as not processed.
	 */
	public function clean_streets()
	{
		$stmt = $this->mydb->prepare('TRUNCATE TABLE placestreets'); // KILL data!
		$stmt->execute();
		$stmt = $this->mydb->prepare('UPDATE places SET processed = 0');
		$stmt->execute();
	}

	/**
	 * Sets a city as being processed, while importing
	 * Can be used to manually identify non-processed, so deleted cities
	 */
	public function set_city_processed($osm_id)
	{
		try {
			$stmt = $this->mydb->prepare('UPDATE places SET processed = 1 WHERE osm_id = :id');
			$stmt->execute(array(
				':id' => $osm_id,
			));
		} catch (PDOException $e) {
			echo 'MySQL INSERT error in set_city_processed: ' . $e->getMessage();
			die();
		}
	}

	/**
	 * Inserts a new city and marks it being processed
	 */
	public function create_city($city)
	{
		try {
			$query = 'INSERT INTO places (osm_id, name, lat, lon, processed, population)';
			$query .= ' VALUES (:id, :name, :lat, :lon, 2, 0)';
			$stmt = $this->mydb->prepare($query);
			$stmt->execute(array(
				':id' => $city->osm_id,
				':name' => $city->name,
				':lat' => $city->lat,
				':lon' => $city->lon,
			));
		} catch (PDOException $e) {
			$dbErrorCode = $stmt->errorInfo()[1];
			// On unique constraint fail for osm_id or name
			if ($e->getCode() == 23000 && $dbErrorCode == 1062) {
				echo $city->name . ' has already been inserted. New osm id would have been: ' . $city->osm_id . ". Skipping ";
			} else {
				printf('MYSQL INSERT error in create_city(%d, %s): ', $city->osm_id, $city->name);
				die($e->getMessage());
			}
		}
	}

	/**
	 * Updates an existing city and marks it being processed
	 */
	public function update_city($city)
	{
		try {
			$query = 'UPDATE places SET name = :name, lat = :lat, lon = :lon, processed = 2';
			$query .= ' WHERE osm_id = :id AND (name != :name OR lat != :lat OR lon != :lon)';
			$stmt = $this->mydb->prepare($query);
			$stmt->execute(array(
				':id' => $city->osm_id,
				':name' => $city->name,
				':lat' => $city->lat,
				':lon' => $city->lon,
			));
		} catch (PDOException $e) {
			echo 'MySQL UPDATE error in update_city: ' . $e->getMessage();
			die();
		}
	}

	public function change_city_id($oldCity, $newCity)
	{
		try {
			$stmt = $this->mydb->prepare('UPDATE places SET osm_id = :newId WHERE osm_id = :oldId');
			$res = $stmt->execute(array(
				':oldId' => $oldCity->osm_id,
				':newId' => $newCity->osm_id,
			));
			printf(":d row updated in `places` from %d to %d" . endl, $res, $oldCity->osm_id, $newCity->osm_id);
		} catch (PDOException $e) {
			printf('MySQL UPDATE error in change_city_id(%d, %d): ', $oldCity->osm_id, $newCity->osm_id);
			die($e->getMessage());
		}
	}

	/**
	 * Load cities already imported into our database
	 *
	 * @param $letter string Starting letter of cities to load, when paging. Loads all if empty.
	 * @param $loadtags bool Whether to load tags of the cities
	 * @returns Array of City objects extended with "tags" array.
	 */
	public function load_cities($letter = "", $loadtags = false)
	{
		try {
			$ret = array();
			// Load places starting with a letter
			$where = "";
			if ($letter) {
				if ($letter == "o") {
					$where = " WHERE (places.name LIKE 'o%' OR places.name LIKE 'ö%' OR places.name LIKE 'ő%')";
				} elseif ($letter == "u") {
					$where = " WHERE (places.name LIKE 'u%' OR places.name LIKE 'ú%' OR places.name LIKE 'ű%')";
				} else {
					$where = " WHERE places.name LIKE '" . $letter . "%' ";
				}
			}
			$tags_join = "";
			$tags_cols = "";
			if ($loadtags) {
				$tags_join = " LEFT JOIN placetags ON places.osm_id = placetags.place_id "
					. "LEFT JOIN tags on placetags.tag_id = tags.id";
				$tags_cols = ", placetags.date as keydate, tags.name as keyname, tags.value as keyvalue, tags.id as keyid";
			}
			$query = 'SELECT places.osm_id, places.name, places.lat, places.lat, places.lon';
			$query .= $tags_cols . ' FROM places' . $tags_join . ' ' . $where . 'ORDER BY places.name';
			$stmt = $this->mydb->prepare($query);
			$stmt->execute();

			$lastid = 0;
			$city = null;
			while ($row = $stmt->fetch()) {
				if ($lastid != $row["osm_id"]) {
					if ($city) {
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
				if (array_key_exists('keyname', $row) && $row['keyname']) {
					if (!isset($city->tags)) {
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
			if ($city) {
				array_push($ret, $city);
			}
			return $ret;
		} catch (PDOException $e) {
			echo "MySQL SELECT error in load_cities with letter " . $letter . ": " . $e->getMessage();
			die();
		}
	}

	/**
	 * Loads street names that are already imported to our database
	 *
	 * @returns array key=street name, value=local ID
	 */
	public function load_streetnames()
	{
		try {
			$res = array();
			$stmt = $this->mydb->prepare('SELECT id, name FROM streetnames');
			$stmt->execute();
			while ($row = $stmt->fetch()) {
				$res[$row["name"]] = $row["id"];
			}
			return $res;
		} catch (PDOException $e) {
			echo "MySQL SELECT error in load_streetnames: " . $e->getMessage();
			die();
		}
	}

	/**
	 * Inserts a new street name to the database. Names must be unique.
	 *
	 * @returns int ID of the new street name
	 */
	public function create_streetname($name)
	{
		try {
			$stmt = $this->mydb->prepare('INSERT INTO streetnames (name) VALUES (:name)');
			$stmt->execute(array(
				':name' => $name
			));
			return $this->mydb->lastInsertID();
		} catch (PDOException $e) {
			echo 'MySQL INSERT error in create_streetname(' . $name . '): ' . $e->getMessage();
			die();
		}
	}

	/**
	 * Assigns a section of a street (osm way) to a city
	 */
	public function assign_street_way($osm_id, $place_id, $streetname_id)
	{
		try {
			$query = 'INSERT INTO placestreets (osm_id, place_id, streetname_id)';
			$query .= ' VALUES (:id, :placeId, :streetNameId)';
			$stmt = $this->mydb->prepare($query);
			$stmt->execute(array(
				':id' => $osm_id,
				':placeId' => $place_id,
				':streetNameId' => $streetname_id,
			));
		} catch (PDOException $e) {
			printf('MySQL INSERT error in assign_street_way(%d, %d, %d): ', $osm_id, $place_id, $streetname_id);
			die($e->getMessage());
		}
	}

	/**
	 * Copies all content of "name" to "name_case", which is a binary column for Case Senstive match.
	 */
	public function copy_names_case()
	{
		try {
			$stmt = $this->mydb->prepare("UPDATE streetnames SET name_case = name");
			$stmt->execute();
		} catch (PDOException $e) {
			echo 'MySQL UPDATE error in copy_names_case: ' . $e->getMessage();
			die();
		}
	}

	/**
	 * Delete names that don't anymore belong to anything - at end of a new import
	 */
	public function delete_unused_names()
	{
		try {
			$query = 'DELETE streetnames.* FROM streetnames';
			$query .= ' LEFT JOIN placestreets ON streetnames.id = placestreets.streetname_id';
			$query .= ' WHERE placestreets.streetname_id IS NULL';
			$stmt = $this->mydb->prepare($query);
			$stmt->execute();
		} catch (PDOException $e) {
			echo 'MySQL DELETE error in delete_unused_names: ' . $e->getMessage();
			die();
		}
	}

	/**
	 * Adds a tag to a city
	 */
	public function add_tag($place_id, $tag_id)
	{
		try {
			$stmt = $this->mydb->prepare('INSERT INTO placetags (place_id, tag_id) VALUES (:placeId, :tagId)');
			$stmt->execute(array(
				':placeId' => $place_id,
				':tagId' => $tag_id,
			));
		} catch (PDOException $e) {
			echo 'MySQL DELETE error in add_tag: ' . $e->getMessage();
			die();
		}
	}
}

/* PostGIS Db function */

class GisDB
{
	public $gis; // Connection
	private $foreign;

	public function __construct()
	{
		require_once 'config/pgsql.php';
		$this->gis = $db;
		include dirname(__FILE__) . '/scripts/foreign.php';
		$this->foreign = $foreign;
	}

	// Load city "place" nodes from OSM database
	// returns array: key=place name, value=City data
	public function load_cities()
	{
		$centers = array();
		$query = "SELECT osm_id, name,";
		$query .= " ST_X(ST_Transform(way, 4326)) as lon,";
		$query .= " ST_Y(ST_Transform(way, 4326)) as lat";
		$query .= " FROM planet_osm_point";
		$query .= " WHERE name != 'Budapest' AND place IN('city', 'town', 'village')";
		try {
			$stmt = $this->gis->prepare($query);
			$stmt->execute();

			while ($row = $stmt->fetch()) {
				if (array_key_exists($row['name'], $centers)) {
					throw new DuplicateCityException(
						$row["name"],
						$centers[$row["name"]]->osm_id,
						$row["osm_id"]
					);
				}
				if (!in_array($row["osm_id"], $this->foreign)) {
					$city = new City();
					$city->name = $row["name"];
					$city->osm_id = $row["osm_id"];
					$city->lat = $row["lat"];
					$city->lon = $row["lon"];
					$centers[$row["name"]] = $city;
				}
			}
		} catch (DuplicateCityException $e) {
			echo $e->getMessage();
			die();
		} catch (PDOException $e) {
			echo 'Postgresql error in load_cities: ' . $e->getMessage();
			die();
		}

		return $centers;
	}

	public function get_boundary_iterator()
	{
		return new BoundaryIterator($this->gis);
	}
}

/**
 * Iterates admin level boundaries that we import
 */
class BoundaryIterator implements Iterator
{
	private $gis;
	private $foreign;
	private $stmt;
	private $curr;
	private $started = false;

	public function __construct($dbconn)
	{
		$this->gis = $dbconn;
		include dirname(__FILE__) . '/scripts/foreign.php';
		$this->foreign = $foreign;
	}

	private function start()
	{
		// Get place boundaries from PostGIS (except Budapest)
		$query = "SELECT osm_id,name,";
		$query .= " ST_X(ST_Transform(ST_Centroid(way), 4326)) as boundlon,";
		$query .= " ST_Y(ST_Transform(ST_Centroid(way), 4326)) as boundlat";
		$query .= " FROM planet_osm_polygon WHERE boundary = 'administrative'";
		$query .= " AND admin_level IN ('8','9') AND name != 'Budapest'";
		$query .= " ORDER BY name COLLATE \"hu_HU\"";
		$this->stmt = $this->gis->prepare($query);
		$this->stmt->execute();
		$this->curr = $this->stmt->fetch();
	}

	private function fetch()
	{
		if (!$this->started) {
			$this->start();
			$this->started = true;
		}
		do {
			$this->curr = $this->stmt->fetch();
		} while ($this->curr && in_array($this->curr["osm_id"], $this->foreign)); // Skip foreign cities
	}

	public function rewind(): void
	{
		if (!$this->curr) {
			$this->start();
		}
	}

	public function current(): mixed
	{
		return $this->curr;
	}

	public function key(): mixed
	{
		return $this->curr["osm_id"];
	}

	public function next(): void
	{
		$this->fetch();
	}

	public function valid(): bool
	{
		return ($this->curr != null);
	}
}

/**
 * Represents basic city data
 */
class City
{
	public $osm_id;
	public $name;
	public $lat;
	public $lon;

	public function __toString()
	{
		return $this->name;
	}
}
