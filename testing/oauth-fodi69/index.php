<?php

require_once 'shared.php';

$authenticated = $_SESSION['token'] && $_SESSION['secret'];

if ($authenticated) {
	header('Location: user.php');
	exit;
}

include 'templates/noAuth.php';
