<?php
include_once 'Entity/OSMKeys.php';
include_once 'Entity/OSMNode.php';
include_once 'Entity/OSMWay.php';
include_once 'Entity/OSMRelation.php';

class OSMDataHandler2 {
    public $rootAttributes = array();
    public $nodes = array();
    public $ways = array();
    public $relations= array();
    private $rootAttributesLoaded = false;
    private $nodesLoaded = false;
    private $waysLoaded = false;
    private $relationsLoaded = false;
    
    public function isRootAttributesLoaded(){ return $this->rootAttributesLoaded;}
    public function isNodesLoaded(){ return $this->nodesLoaded;}
    public function isWaysLoaded(){ return $this->waysLoaded;}
    public function isRelationsLoaded(){ return $this->relationsLoaded;}
       
    /**
     * Load and parse a given string contains osm data and has xml fromat.
     * @param string $xml The xml document contains osm data.
     * @return bool Result of load process.
     */
    public function loadXML($xml, $rootAttributesEnabled, $nodesEnabled, $waysEnabled, $relationsEnabled){  
        try{
			$this->parse(new SimpleXMLElement($xml), $rootAttributesEnabled, $nodesEnabled, $waysEnabled, $relationsEnabled);
		}catch (Exception $ex){
			if (DEBUG_ENABLED) echo $xml;
			die ($ex->getMessage());
		}
        return true;
    }
    /**
     * Load and parse an .osm file from the given filepath.
     * @param string $filepath Path of the loadable file.
     * @return bool Result of load process.
     */
    public function loadFile($filepath, $rootAttributesEnabled, $nodesEnabled, $waysEnabled, $relationsEnabled){
        if (!file_exists($filepath)) die ("File does not exists: $filepath");
        $this->parse(simplexml_load_file($filepath), $rootAttributesEnabled, $nodesEnabled, $waysEnabled, $relationsEnabled);
        return true;
    }
    
    /**
     * Write nodes, ways and relations to a DOMDocument and set rootAttributes on the root element.
     * @return DOMDocument
     */
    protected function save(){
        $doc = new DOMDocument('1.0','UTF-8');
        $doc->formatOutput=true;
        //$doc->registerNodeClass("DOMElement", "OSMElement");
        $root = $doc->createElement('osm');
        
        //add original attributes for root
        if($this->isRootAttributesLoaded()){                   
            foreach ($this->rootAttributes as $key=>$value){
                $root->setAttribute($key, $this->rootAttributes[$key]);
            }        
        }
        //add nodes to root       
        if($this->isNodesLoaded()){
            foreach ($this->nodes as $node){
                $root->appendChild($node->toDomElement($doc));
            }
        }
        
        //add ways to root
        if($this->isWaysLoaded()){
            foreach ($this->ways as $way){
                $root->appendChild($way->toDomElement($doc));
            }
        }
        
        //add relations to root
        if ($this->isRelationsLoaded()){
            foreach ($this->relations as $relation){
                $root->appendChild($relation->toDomElement($doc));
            }
        }
        
        $doc->appendChild($root);
        return $doc;
    }
    
    /**
     * Write nodes, ways and relations to the given file.
     * @param type $filename output file path.
     */
    public function saveFile($filepath){
        $this->save()->save($filepath);
    }
    
    /**
     * Write nodes, ways and relations to a string.
     * @return string XML file content.
     */
    public function saveXML(){        
        return $this->save()->saveXML();
    }
    
    /**
     * Parse nodes, ways and relations from the given DomDocument.
     * @param DomDocument $domDocument Opened DomDocument ready to parse.
     */
    protected function parse($simpleXmlRootElement, $rootAttributesEnabled, $nodesEnabled, $waysEnabled, $relationsEnabled){
        //$domDocument->registerNodeClass("DOMElement", "OSMElement");
        //$root = $domDocument->documentElement;
        
        if ($rootAttributesEnabled){
            $this->rootAttributes = $this->parseRootAttributes($simpleXmlRootElement);
            $this->rootAttributesLoaded=true;
        }
        if ($nodesEnabled){
            $this->nodes = $this->parseNodes($simpleXmlRootElement);
            $this->nodesLoaded = true;
        }
        if ($waysEnabled){
            $this->ways = $this->parseWays($simpleXmlRootElement);
            $this->waysLoaded = true;
        }
        if ($relationsEnabled){
            $this->relations = $this->parseRelations($simpleXmlRootElement);
            $this->relationsLoaded = true;
        }
    }
    
    /**
     * Parse all root attributes from a given root element.
     * @param OSMElement $rootElement Root OSMElement of the parsed document.
     * @return array Return an array of attributes.
     */
    protected  function parseRootAttributes($rootElement){
        $result = array();
        foreach ($rootElement->attributes() as $key=>$value){
            $result[$key] = $value;
        }
        return $result;
    }
    /*protected  function parseRootAttributes($rootElement){
        $result = array();
        foreach($rootElement->attributes as $attr){
            $result[$attr->nodeName] = $attr->nodeValue;
        }
        return $result;
    }*/
    
    /**
     * Parse all nodes from a given root element and index them by Id.
     * @param OSMElement $rootElement Root OSMElement of the parsed document.
     * @return array Return an associative array of nodes indexed by Id.
     */
    protected  function parseNodes($rootElement){
        $result = array();
        foreach($rootElement->node as $element){
            $tmp = new OSMNode();
            $tmp->parseFromSimpleXML($element);
            $result[$tmp->getId()] = $tmp;
        }
        return $result;
    }
    
    /**
     * Parse all ways from a given root element and index them by Id.
     * @param OSMElement $rootElement $rootElement Root OSMElement of the parsed document.
     * @return array Return an associative array of ways indexed by Id.
     */
    protected function parseWays($rootElement){
        $result = array();
        foreach($rootElement->way as $element){
            $tmp = new OSMWay();
            $tmp->parseFromSimpleXML($element);
            $result[$tmp->getId()] = $tmp;
        }
        return $result;
    }
    
    /**
     * Parse all relations from a given root element and index them by Id.
     * @param OSMElement $rootElement $rootElement Root OSMElement of the parsed document.
     * @return array Return an associative array of ways indexed by Id.
     */
    protected function  parseRelations($rootElement){
        $result = array();
        foreach($rootElement->relation as $element){
            $tmp = new OSMRelation();
            $tmp->parseFromSimpleXML($element);
            $result[$tmp->getId()] = $tmp;
        }
        return $result;
    }
}

?>
