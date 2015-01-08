<?php
include_once 'APIBase.php';
include_once 'OSM/BoundingBox.php';

class OverpassWebApiHandler extends APIBase  {
    
    public function __construct() {
        $this->api_url = "http://www.overpass-api.de/api/";
    }
    
    public function downloadByBoundingBox($bbox) {
        $command="xapi?*[@meta][bbox=$bbox->left,$bbox->bottom,$bbox->right,$bbox->top]";
        return $this->GET($command);
    }
    
    public function downloadByBoundingBoxUsingFilters($bbox){
        //interpreter?data=((rel[landuse](47.65,17.85,47.77,18.11);rel[natural](47.65,17.85,47.77,18.11););way(r);node(w);
        //(way[boundary=administrative](47.65,17.85,47.77,18.11);node(w));
        //((way[natural](47.65,17.85,47.77,18.11);way[landuse](47.65,17.85,47.77,18.11););););out%20meta;

        $command = "interpreter?data=(".
                    "(".
                        "rel[landuse]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);".
                        "rel[natural]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);".
                    ");"."way(r);node(w);".
                    "(".
                        "way[boundary=administrative]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);node(w);".
                    ");".
                    "(".
                        "(".
                            "way[landuse]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);".
                            "way[natural]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);".
                        ");".
                        "node(w);".
                    ");".
                   ");out%20meta;";/*
        $command = "interpreter?data=(rel[landuse]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);".
                                    "way[landuse]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);".
                                    "rel[natural]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);".
                                    "way[natural]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right););".
                                    //"way[boundary=administrative]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);node(w));".
                                    "(._;way(r)($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);node(w););".
                                    "(._;way[boundary=administrative]($bbox->bottom,$bbox->left,$bbox->top,$bbox->right);node(w););".
                                    "out%20meta;";*/
        return $this->GET($command);
    }
}

?>
