<?php
/**
 * Description of OSMWay
 *
 * @author Csati
 */

include_once 'OSMBase.php';
include_once 'OSMKeys.php';

class OSMWay extends OSMBase{
    public $nodes = array();

    public function getType() {
        return OSMKeys::TYPE_WAY;
    }

    public function parseFromSimpleXML($element) {       
        parent::parseFromSimpleXML($element);
        
        foreach ($element->nd as $value){
            $this->nodes[] = $value[OSMKeys::ATTRIBUTE_REFERENCE];
        }
    }
    
    public function toDomElement($domDoc) {
        $result = parent::toDomElement($domDoc);
        foreach ($this->nodes as $node){
            $tmpNode = $domDoc->createElement(OSMKeys::TYPE_WAY_NODE);
            $tmpNode->setAttribute(OSMKeys::ATTRIBUTE_REFERENCE,$node);
            $result->appendChild($tmpNode);
        }        
        return $result;
    }
}

?>
