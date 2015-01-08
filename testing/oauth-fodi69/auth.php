<?php

include_once 'shared.php';

$newSession = !isset($_GET['oauth_token']) && !$_SESSION['state'];

if ($newSession) {
	try {
		$request_token_info = $oauth->getRequestToken(OAUTH_TOKEN_REQUEST_URL);
		$_SESSION['secret'] = $request_token_info['oauth_token_secret'];
		$_SESSION['state']  = 1;
		$url = OAUTH_AUTHORIZE_URL;
		$url.= '?oauth_token=' . $request_token_info['oauth_token'];
		header('Location: ' . $url);
		exit;
	} catch (OAuthException $exception) {
		echo $exception->getMessage();
		session_destroy();
	}
}

if ($_SESSION['state'] == 1) {
	try {
		$oauth->setToken($_GET['oauth_token'], $_SESSION['secret']);
		$access_token_info  = $oauth->getAccessToken(OAUTH_TOKEN_ACCESS_URL);
		$_SESSION['state']  = 'ok';
		$_SESSION['token']  = $access_token_info['oauth_token'];
		$_SESSION['secret'] = $access_token_info['oauth_token_secret'];
		header('Location: index.php');
		exit;
	} catch (OAuthException $exception) {
		echo $exception->getMessage();
		session_destroy();
	}
}
