<?php

// This file includes the environment specific config file

$devEnv = 'development' === getenv('APPLICATION_ENV');

if ($devEnv) {
	require_once 'development.php';
} else {
	require_once 'production.php';
}
