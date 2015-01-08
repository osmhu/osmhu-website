<?php

class BoundingBox {
    public $left=0;
    public $right=0;
    public $top=0;
    public $bottom=0;
       
    public function parseFromSimpleXMLElement($xmlElement){        
        if (count($xmlElement)>0){
            $this->left=1000; $this->right=-1000; $this->top=-100; $this->bottom=100;
        }        
        foreach ($xmlElement as $node){
            $lat = (float)$node['lat'];
            $lon = (float)$node['lon'];
            if ($lon<$this->left) $this->left = $lon;
            if ($lon>$this->right) $this->right = $lon;
            if ($lat>$this->top) $this->top = $lat;
            if ($lat<$this->bottom) $this->bottom = $lat;   
        }
    }
    
    public function expandBorders($leftExpand,$rightExpand,$topExpand,$bottomExpand){
        $this->left-=$leftExpand;
        $this->right+=$rightExpand;
        $this->top+=$topExpand;
        $this->bottom-=$bottomExpand;
    }
    
    public function expandBordersWithSame($expandValue){
        $this->expandBorders($expandValue, $expandValue, $expandValue, $expandValue);
    }
}

?>
