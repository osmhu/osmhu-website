<?php

/**
 * Returns a JSON list of city names, that have a match in the beginning
 * The list is ordered by the population of the city, so bigger cities are always on top
 * Term is always case insensitive
 * Example:
 * cities.php?term=misk
 * [
 *   'Miskolc',
 *   'Miske'
 * ]
 * Example:
 * cities.php?term=notExist
 * []
 */

$result = new stdClass();

if (isset($_GET['term'])) {
	require_once '../config/mysql.php';

	try {
		$query = 'SELECT name FROM places WHERE name LIKE ? ORDER BY population DESC LIMIT 20';

		$stmt = $db->prepare($query);

		$params = array($_GET['term'] . '%');

		$stmt->execute($params);

		$cities = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
		if ($cities) {
			$result = $cities;
		}
	} catch (PDOException $e) {
		die('MySQL query error: ' . $e->getMessage());
	}
}

echo json_encode($result);
