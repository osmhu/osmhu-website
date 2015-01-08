<?php

require_once 'config.php';

$dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_DATABASE;
$options = array (
	PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
);

try {

	$db = new PDO($dsn, DB_USERNAME, DB_PASSWORD, $options);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	die('MySQL connect error: ' . $e->getMessage());
}
