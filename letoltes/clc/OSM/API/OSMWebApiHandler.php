<?php
include_once 'APIBase.php';
include_once 'OSM/BoundingBox.php';

class OSMWebApiHandler extends APIBase{
    
    public function __construct() {
        $this->api_url = "http://api.openstreetmap.org/api/0.6/";
    }
    
    public function downloadByBoundingBox($bbox){
        return $this->GET("map?bbox=$bbox->left,$bbox->bottom,$bbox->right,$bbox->top");
    }
}

?>
