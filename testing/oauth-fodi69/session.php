<?php

require_once 'shared.php';

$authenticated = $_SESSION['token'] && $_SESSION['secret'];

if (!$authenticated) {
	header('Location: index.php');
	exit;
}

try {
	$oauth->setToken($_SESSION['token'], $_SESSION['secret']);

	// Fetch user details
	$oauth->fetch(OAUTH_API_URL . '/user/details');
	$response = $oauth->getLastResponse();

	// Store user details as SimpleXML Object
	$responseXml = new SimpleXMLElement($response);
	$oauth_user = $responseXml->user;
} catch (OAuthException $exception) {
	echo $exception->getMessage();
	session_destroy();
	exit;
}
