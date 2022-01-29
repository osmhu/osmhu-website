<?php

/**
 * Returns a JSON list of matched street names of an exact city match in the database
 * Term matching is case insensitive and partial matches are returned too
 * If no exact city is matched in the database, it returns an empty JSON object
 * Example:
 * streets.php?city=Kecskemét&term=A
 * [
 *   'Ádám Jenő utca',
 *   'Ady Endre utca',
 *   ... // up to 20 matches
 * ]
 * Example:
 * streets.php?city=notExist&term=A
 * []
 */

$result = new stdClass();

if (isset($_GET['city'])) {
	require_once '../config/mysql.php';

	try {
		$wholeBudapest = strtolower($_GET['city']) === 'budapest';

		if ($wholeBudapest) {
			$emptyTerm = mb_strlen($_GET['term'], 'UTF-8') === 0;
			if (!$emptyTerm) {
				// Get Budapest part ids from places database
				$stmt = $db->prepare('SELECT osm_id FROM places WHERE name LIKE ?');
				$params = array('Budapest %');

				$stmt->execute($params);

				$place_ids = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
				$place_in = implode(',', $place_ids);
			}
		} else {
			// Get city id from places database
			$stmt = $db->prepare('SELECT osm_id FROM places WHERE name=? LIMIT 1');
			$params = array($_GET['city']);

			$stmt->execute($params);

			$place_id = $stmt->fetch(PDO::FETCH_COLUMN, 0);
			if ($place_id) {
				$place_in = $place_id;
			}
		}

		if (isset($place_in)) {
			$query = 'SELECT DISTINCT MAX(placestreets.osm_id) AS id, streetnames.name AS name '
				.'FROM streetnames '
				.'INNER JOIN placestreets ON streetnames.id=placestreets.streetname_id '
				.'WHERE placestreets.place_id IN (' . $place_in . ') '
				.'AND streetnames.name LIKE ? '
				.'GROUP BY name '
				."ORDER BY streetnames.name REGEXP '^[a-z]' DESC, streetnames.name "
				.'LIMIT 20';

			$stmt = $db->prepare($query);
			$params = array($_GET['term'] . '%');

			$stmt->execute($params);

			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		}
	} catch (PDOException $e) {
		http_response_code(500);
		die('MySQL lekérdezés hiba: ' . $e->getMessage());
	}
}

header('Content-type: application/json; charset=utf-8');
echo json_encode($result);
