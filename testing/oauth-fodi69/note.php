<?php

require_once 'session.php';

if ($_POST['coordinates']) {
	$coordinates = explode('/', $_POST['coordinates']);

	$details = array (
		'lat'  => $coordinates[0],
		'lon'  => $coordinates[1],
		'text' => $_POST['text']
	);

	try {
		// Post the note update
		$oauth->fetch(OAUTH_API_URL . '/notes', // protected_resource_url
					  $details, // extra_parameters
					  OAUTH_HTTP_METHOD_POST); // http_method
		$response = $oauth->getLastResponse();

		include 'templates/noteCreated.php';
	} catch (OAuthException $exception) {
		echo $exception->getMessage();
		session_destroy();
		exit;
	}
} else {
	include 'templates/noteForm.php';
}
