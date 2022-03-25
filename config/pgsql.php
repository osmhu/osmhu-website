<?php

require_once 'config.php';

$dsn = 'pgsql:host=' . PGSQL_HOST . ';dbname=' . PGSQL_DATABASE;

try {
	$db = new PDO($dsn, PGSQL_USERNAME, PGSQL_PASSWORD);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	$devEnv = 'development' === getenv('APPLICATION_ENV');

	if ($devEnv) {
		die('PostgreSQL kapcsolódási hiba: ' . $e->getMessage());
	} else {
		die('Nem sikerült elérni az adatbázist!');
	}
}
