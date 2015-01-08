<?php
/**
 * Description of OSMNode
 *
 * @author Csati
 */

include_once 'OSMBase.php';
include_once 'OSMKeys.php';

class OSMNode extends OSMBase {

    public function getType(){
        return OSMKeys::TYPE_NODE;
    }
    
    public function getLatitude(){ return $this->attributes[OSMKeys::ATTRIBUTE_LATITUDE]; }
    
    public function setLatitude($value){$this->attributes[OSMKeys::ATTRIBUTE_LATITUDE] = $value;}
    
    public function getLongitude(){ return $this->attributes[OSMKeys::ATTRIBUTE_LONGITUDE]; }
    
    public function setLongitude($value){$this->attributes[OSMKeys::ATTRIBUTE_LONGITUDE] = $value;}
    
    public function parseFromSimpleXML($element) {
        //if ($element->getName()!=OSMKeys::NODE_TYPE) throw new Exception("Given element is not NODE, but ".$element->getName());
        parent::parseFromSimpleXML($element);
    }
}

?>
