<?php
include 'EpiCurl.php';
include 'EpiOAuth.php';
include 'OsmOAuth.php'; // Contains the keys

session_start();

if (isset($_GET['oauth_token'])) $callbackToken = $_GET['oauth_token'];

if (!isset($_SESSION['tok']) && isset($callbackToken) ) {
	//The user has been to OpenStreetMap.org to authorize. Now we need to get an access token 
	
    print "Initialising OsmOAuth with the consumer token<br>\n";
    $osmObj = new OsmOAuth($consumer_key, $consumer_secret);
        
    print "Getting an access token for '$callbackToken'...<br>\n";
    $osmObj->setToken($callbackToken);
    $token = $osmObj->getAccessToken();
	var_dump($token);
    
    print "Storing access token for your session<br>\n";
    $_SESSION['tok'] = $token->oauth_token;
    $_SESSION['sec'] = $token->oauth_token_secret;
} else {
	echo("Valami hiba történhetett az azonosítás során.");
}

