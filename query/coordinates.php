<?php

/**
 * Returns a JSON with the coordinates of an exact match in the database
 * If no exact place is found in the database, it returns an empty JSON object
 * Example:
 * coordinates.php?name=notExist
 * {}
 * Example:
 * coordinates.php?name=Miskolc
 * {
 *   lat: "48.1032974676839",
 *   lon: "20.7911674182743"
 * }
 */

$result = new stdClass();

if (isset($_GET['name'])) {
	require_once '../config/mysql.php';

	try {
		$stmt = $db->prepare('SELECT lat, lon FROM places WHERE name=? LIMIT 1');

		$params = array($_GET['name']);

		$stmt->execute($params);

		$coordinates = $stmt->fetch(PDO::FETCH_ASSOC);
		if ($coordinates) {
			$result = $coordinates;
		}
	} catch (PDOException $e) {
		http_response_code(500);
		die('MySQL lekérdezés hiba: ' . $e->getMessage());
	}
}

header('Content-type: application/json; charset=utf-8');
echo json_encode($result);
