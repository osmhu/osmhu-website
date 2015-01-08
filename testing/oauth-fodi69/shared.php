<?php

session_start();

$devEnv = 'development' === getenv('APPLICATION_ENV');

if ($devEnv) {
	require_once 'config-development.php';
} else {
	require_once 'config-production.php';
}

try {
	$oauth = new OAuth (
		OAUTH_KEY, // consumer_key
		OAUTH_SECRET, // consumer_secret
		OAUTH_SIG_METHOD_HMACSHA1, // signature_method
		OAUTH_AUTH_TYPE_URI  // auth_type
	);

	if ($devEnv) $oauth->enableDebug();
} catch (OAuthException $exception) {
	echo $exception->getMessage();
}
