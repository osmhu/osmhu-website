<?php
include 'EpiCurl.php';
include 'EpiOAuth.php';
include 'OsmOAuth.php';
include 'secret.php';

session_start();

if (isset($_GET['oauth_token'])) $callbackToken = $_GET['oauth_token'];

$action="";
if (isset($_GET['action'])) $action = $_GET['action'];

if ($action=="endsession") {
	//user clicked "End Session" link
    session_unset();
    session_destroy();
    
} elseif ($action=="authorize") {
	//user clicked "authorize with OpenStreetMap" link
    $osmObj = new OsmOAuth($consumer_key, $consumer_secret);
	$authurl = $osmObj->getAuthorizationUrl()  .  "&callback=http://funmap.co.uk/tageditor/epiosm/"; //This hits requestTokenUrl
	header('Location: '.$authurl ); //Redirect the user to the OpenStreetMap.org to authorize
    exit;
    
} elseif (!isset($_SESSION['tok']) && isset($callbackToken) ) {
	//The user has been to OpenStreetMap.org to authorize. Now we need to get an access token 
	
    print "Initialising OsmOAuth with the consumer token<br>\n";
    $osmObj = new OsmOAuth($consumer_key, $consumer_secret);
        
    print "Getting an access token...<br>\n";
    $osmObj->setToken($callbackToken);
    $token = $osmObj->getAccessToken();
    
    print "Storing access token for your session<br>\n";
    $_SESSION['tok'] = $token->oauth_token;
    $_SESSION['sec'] = $token->oauth_token_secret;
} //endif


if (isset($_SESSION['tok'])) {
	//we have an access token. We can do stuff (or carry on doing stuff)
	
	if (!isset($osmObj))  $osmObj = new OsmOAuth($consumer_key, $consumer_secret);

	$accesstoken       = $_SESSION['tok'];
	$accesstokensecret = $_SESSION['sec'];
	
	$osmObj->setToken($accesstoken, $accesstokensecret);
	
    
	if (isset($_GET['id'])) $id = $_GET['id'];
	if (isset($_GET['type'])) $type = $_GET['type'];
	if (isset($_GET['tag'])) $requestedTag = $_GET['tag'];

    if ($action=="viewobject" || $action=="viewtag" || $action=="edittag" || $action=="doedit") {
			
	    if ($type!="node" && $type!="way" && $type!="relation") {
            print "invalid type";
	    	exit();
	    }
	    if (!is_numeric($id)) {
	        print "invalid id";
	    	exit();
	    }
	
			
	    //Request object data from OSM
		$url = $osmObj->apiUrl . "/" . $type . "/" . $id;
        $xml = @file_get_contents($url);
        if (preg_match('#^HTTP/... 4..#', $http_response_header[0])) {
             print "ERROR getting object " .  $http_response_header[0] . "<br>\n";
			 print "URL " . $url . "<br>\n";
			 exit();
             
        } else {         
        		 
             $doc = new DOMDocument();
             $doc->loadXML( $xml);
             
             $objElems  = $doc->getElementsByTagName($type);
             $objElem   = $objElems->item(0);
             $user      = $objElem->getAttribute('user');
             $timestamp = $objElem->getAttribute('timestamp');
             
             $tags = $doc->getElementsByTagName( "tag" );
			 
             //print count($tags)+1 . " tags<br>\n";
			 
			 $currentValue="";
             foreach( $tags as $tag )
             {
                 $key=$tag->getAttribute('k');
                 $value=$tag->getAttribute('v');
                 
				// print "TAG:" . htmlspecialchars($key) . "=". htmlspecialchars($value) . "<br>\n";
				 
				 if ($key==$requestedTag) $currentValue=$value;
             }
			 
		}
	} //endif
		
	
    if ($action=="viewobject") {	
        //Show all the tags of a particular object
 		
    } elseif ($action=="viewtag") {
        //Show a particalar tag of a particular object
		print "<p>" . htmlspecialchars($requestedTag) . "=" . htmlspecialchars($currentValue) . "<p>\n";
		print "<p><a href=\"./index.php?action=edittag&id=$id&type=$type&tag=".urlencode($requestedTag)."\">Edit this tag</a></p>\n";
		print "<hr>\n";
    	print "<p><a href=\"./index.php?action=chooseobject\">Edit a different object</a> | \n";
		print "   <a href=\"./index.php?action=endsession\">End session</a></p>\n";
    	
    	
    } elseif ($action=="edittag") {
        //Show form for editing a particalar tag  
		?>
		
		<form action="index.php" method="GET">
		<input type="hidden" name="action" value="doedit">
		<input type="hidden" name="id" value="<?php print $id; ?>">
		<input type="hidden" name="type" value="<?php print $type; ?>">
		<input type="hidden" name="tag" value="<?php print htmlspecialchars($requestedTag); ?>">
		<table border="0" cellspacing="0" cellpadding="0">
        <tr><td align="right"><?php print htmlspecialchars($requestedTag); ?>=</td><td><?php print htmlspecialchars($currentValue); ?></td></tr>
		<tr><td>New value:</td><td><input type="text" name="newvalue" value="<?php print htmlspecialchars($currentValue); ?>" size="40" />
		<input type="submit"></td></tr>
		</table>
		</form>
		
		<hr>
    	<p><a href="./index.php?action=chooseobject">Edit a different object</a> | 
		   <a href="./index.php?action=endsession">End session</a></p>
    	
		<?php
		
		
		
    } elseif ($action=="doedit") {
		//Save changes to a tag (make an edit)
		
		$newValue = $_GET['newvalue'];
		
		$changsetxml  = "<osm>";
		$changsetxml .= "<changeset>";
		$changsetxml .= "    <tag k=\"created_by\" v=\"harrystestapp\"/>";
		$changsetxml .= "    <tag k=\"comment\" v=\"test changeset\"/>";
		$changsetxml .= "</changeset>";
		$changsetxml .= "</osm>";
		
		print "XML:" . htmlspecialchars($changsetxml) . "<br><br>";
		$params = array('data' => $changsetxml );
    	$createResult = $osmObj->put_changesetCreate( $params );
    	$createResult->response; //triggers the actual get of a queued EpiCurl request
    
		if ($createResult->code < 200 || $createResult->code > 299 )  {
           print "<h3>Error while creating changeset:</h3>\n";
		   print "<p>" . htmlspecialchars($createResult->data) . "</p>\n";
    	   print "<p>(HTTP response code:" . htmlspecialchars($createResult->code) . ")</p>\n";
		   
		} else {
		   //Success!
		   $changesetId = $createResult->data;
           
		   print "<br><br>SUCCESS! changeset id:" . $changesetId;
		   
		   
		   //Swap in the new changeset id
		   $objectElem = $doc->getElementsByTagName( $type )->item(0);
           $objectElem->setAttribute('changeset', $changesetId);
		   
		   //Swap in the new tag value
		   $tags = $doc->getElementsByTagName( "tag" );
           foreach( $tags as $tag )
           {
               $key=$tag->getAttribute('k');
               //$value=$tag->getAttribute('v');
               if ($key==$requestedTag) $tag->setAttribute('v', $newValue);
           }
		   $editedxml = $doc->saveXML();

		   
		   
		   $func = "put_" . $type . $id;
		   print "XML:" . htmlspecialchars($editedxml) . "<br><br>";
		   $params = array('data' => $editedxml );
    	   $editResult = $osmObj->$func( $params );
		   
    	   if ($editResult->code < 200 || $editResult->code > 299 )  {
              print "<h3>Error while updating object:</h3>\n";
		      print "<p>" . htmlspecialchars($editResult->data) . "</p>\n";
    	      print "<p>(HTTP response code:" . htmlspecialchars($editResult->code) . ")</p>\n";
		      
		   } else {
              //Success!
		      $newVersion = $editResult->data;
              print "<br><br>SUCCESS! new object version:" . $newVersion;
		   		      
		   } 
		}
    	print "<a href=\"./index.php\">Home</a> \n";
		
		
    } elseif ($action=="viewprefs") {
        //Show this user's prefs
    
    	$preferencesResult = $osmObj->get_userPreferences();
    	$preferencesResult->response; //triggers the actual get of a queued EpiCurl request
    
    	print "<h3>Your preferences XML:</h3>\n";
    	print "<pre>" . htmlspecialchars($preferencesResult->data) . "</pre>\n";
    
    	print "<hr><a href=\"./index.php\">Home</a> \n";
		
    } else {
    	?>
    	
    	<p>Which object would like you to edit?</p>
    	
    	<form action="./index.php" method="GET">
    	
    	<input type="hidden" name="action" value="viewtag"/>
    	
    	<select name="type">
    	<option>node</option>
    	<option>way</option>
    	<option>relation</option>
    	</select>
    	&nbsp;&nbsp;
    	ID: <input type="textbox" size=10 name="id" />
    	
    	<p>Which tag would like you to edit? (enter the key)</p>
    	
    	Tag: <input type="textbox" size=15 name="tag" />
    	
    	<input type="submit" value="Go!" />
    	</font>
		
    	<?php
    	
    } //endif 
	
} else {
    ?>
    <p>Welcome to the funmap editor</p>
	
	<p>This tool will make edits with your OpenStreetMap user account. You need to authorize this:</p>
	
	<a href="./index.php?action=authorize">Authorize with OpenStreetMap</a></p>
	
	<br><br><br>
	<h3>Description</h3>
	This is currently pointed at the test API/database :
	<a href="http://api06.dev.openstreetmap.org">http://api06.dev.openstreetmap.org</a>.
	You need an account on there, and you need to find an object id from there to try it out
	<br><br>
	Mainly this was my attempt to do OAuth in PHP.  Got it all working eventually except that
	it leaves behind dead OAuth tokens in your list when your session times out.  I dont think
	I can solve that at my ("client" website) end of things.  But I'm also not sure if it's a
	problem or not.
	<br><br>
	<a href="./editor.zip">source code</a>
    <?php
} //endif 
	
