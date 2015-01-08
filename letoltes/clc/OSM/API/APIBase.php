<?php
abstract class APIBase {
    public $api_url = "";
    
    protected function GET($command){
        $url = $this->api_url.$command;         
        if (DEBUG_ENABLED) echo "QUERY URL: ".$url."<br>";
        //solution 2
        if(PROXY_ENABLED){
            $aContext = array(
                'http' => array(
                    'proxy' => 'tcp://'.HTTP_PROXY,
                    'request_fulluri' => true,
                ),
            );
            $cxContext = stream_context_create($aContext);                
            return file_get_contents($url, False, $cxContext);
        }else return file_get_contents($url);
        
        //solution 3
        /*$ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $data = curl_exec($ch);
        curl_close($ch);    
        return $data;*/
    }
    
    public abstract function downloadByBoundingBox($bbox);
}

?>
