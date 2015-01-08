<?php
/**
 * Description of OSMBase
 *
 * @author Csati
 */
abstract class OSMBase {
    private static $nextId = 0;
    public $tags = array();
    public $attributes = array();
    
    public static function setNextId($value){
        OSMBase::$nextId=$value;
    }
    
    public static function getNextId(){
        return $this->$id++;
    }
    
    /*public function __construct($id = 0, $version = 1, $timestamp = "") {
        $this->id = $id;
        $this->version = $version;
        $this->timestamp = $timestamp;
    }*/
    
    abstract public function getType();
    
    public function parseFromSimpleXML($element){        
        if (get_class($element)!="SimpleXMLElement") throw new Exception('Wrong argument type: $element;'. "Expected: SimpleXMLElement; Arrived: ".  get_class($element));        
        if ($element->getName()!=$this->getType()) throw new Exception("Given element is not ".$this->getType().", but ".$element->getName());
        
        foreach ($element->attributes() as $key=>$value){
            $this->attributes[$key] = $value;
        }
        
        foreach ($element->tag as $tag){
            $key = (string)$tag["k"];
            $value = (string)$tag["v"];
            $this->tags[$key] = $value;
        }
    }
    
    public function toDomElement($domDoc){
        $result = $domDoc->createElement($this->getType());
        foreach ($this->attributes as $key=>$value){
            $result->setAttribute($key,$value);
        }
        
        foreach($this->tags as $key=>$value){
            $tmpTag = $domDoc->createElement(OSMKeys::TYPE_TAG);
            $tmpTag->setAttribute("k",$key);
            $tmpTag->setAttribute("v",$value);
            $result->appendChild($tmpTag);
        }
        return $result;
    }
    
    public function getId(){return (int)$this->attributes['id'];}
    public function setId($value) {$this->attributes['id']=(int)$value;}
    
    
}

?>
