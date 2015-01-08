<?php
try{
    include_once 'ErrorsToExceptions.php';
    include_once 'OSM/OSMDataHandler.php';
    include_once 'OSM/CLCManipulation.php';
    include_once 'Benchmark.php';
    include_once 'OSM/BoundingBox.php';
    include_once 'OSM/API/OverpassWebApiHandler.php';
    include_once 'settings.php';

    if (!isset($_REQUEST['sn'])){
        die ('parameter missing: settlementName');
    }
    //remove filter ability
    $useAreaFilter=false;
    /*if (isset($_REQUEST['fd'])){
        $useAreaFilter = (($_REQUEST['fd']=="true")?true:false);
    }else $useAreaFilter = false;*/

    $settlementName = $_REQUEST['sn'];
    $clcFile = CLC_DATA_FOLDER.$settlementName.".osm";
    if (!file_exists($clcFile)) die ("File does not exists: $clcFile");

    header('charset=UTF-8');

    //load data from files
    $clcRelations = new OSMDataHandler2();
    $clcRelations->loadFile($clcFile,false,false,false,true);

    $clcReader = simplexml_load_file($clcFile);
    unset($clcFile);
    //get bounding box for download
    $bbox = new BoundingBox();
    $bbox->parseFromSimpleXMLElement($clcReader->node);
    $bbox->expandBordersWithSame(0.02);
    if (DEBUG_ENABLED) var_dump($bbox);

    if (DEBUG_ENABLED) benchmark();
    try{
        $downloadedData=null;
        $downloader = new OverpassWebApiHandler();
        if ($useAreaFilter) $downloadedData = $downloader->downloadByBoundingBoxUsingFilters ($bbox);
        else $downloadedData = $downloader->downloadByBoundingBox($bbox);
    }  catch (Exception $e){
        var_dump($bbox);
        die($e->getMessage());
    }
    if (DEBUG_ENABLED) echo "Download time: ".benchmark()."<br>";
    if (DEBUG_ENABLED) echo "File:".$downloadedData."\n<br>";

    //load data
    $osmRelations = new OSMDataHandler2();
    $osmRelations->loadXML($downloadedData,false,false,false,true);

    //merge relations
    CLCManipulation::mergeByCLCID($osmRelations->relations, $clcRelations->relations,true);
    unset($clcRelations);

    $osmReader = new SimpleXMLElement($downloadedData);

    $domWriter = new DomDocument('1.0','UTF-8');
    $domWriter->formatOutput=true;
    $root = $domWriter->createElement("osm");
    $root->setAttribute("version", "0.6");
    $domWriter->appendChild($root);

    //adding bounding box
    $bounds = $domWriter->createElement("bounds");
    $bounds->setAttribute("minlat", $bbox->bottom);
    $bounds->setAttribute("minlon", $bbox->left);
    $bounds->setAttribute("maxlat", $bbox->top);
    $bounds->setAttribute("maxlon", $bbox->right);
    $root->appendChild($bounds);

    //copy original nodes
    foreach ($osmReader->node as $child){
        $tmpChild = dom_import_simplexml($child);
        $root->appendChild($domWriter->importNode($tmpChild,true));
    }

    //copy clc nodes
    foreach ($clcReader->node as $child){
        $tmpChild = dom_import_simplexml($child);
        $root->appendChild($domWriter->importNode($tmpChild,true));
    }

    //copy original ways
    foreach ($osmReader->way as $child){
        $tmpChild = dom_import_simplexml($child);
        $root->appendChild($domWriter->importNode($tmpChild,true));
    }
    unset($osmReader);

    //copy original ways
    foreach ($clcReader->way as $child){
        $tmpChild = dom_import_simplexml($child);
        $root->appendChild($domWriter->importNode($tmpChild,true));
    }
    unset($clcReader);

    //add merged relations
    foreach ($osmRelations->relations as $child){
        //$root->appendChild($domWriter->importNode($child,true));
        $root->appendChild($child->toDomElement($domWriter));
    }

    if (DEBUG_ENABLED) echo "Total file handle time: ".  benchmark().'<br>';
    if (DEBUG_ENABLED) echo "Max memory usage: ".memory_get_peak_usage()/1024 . "KB\n";

    //$domWriter->save("merged_".$settlementName.".osm");
    $result = $domWriter->saveXML();
    unset($domWriter);

    if (!DEBUG_ENABLED) header('Content-Type: text/xml');
    if (!DEBUG_ENABLED) header('Content-Type: application/force-download');
    if (!DEBUG_ENABLED) header('Content-Disposition: attachment; filename="merged_clc_'.$settlementName.'.osm"');

    echo $result;
}catch(Exception $ex){
    die($ex->getMessage());
}
?>