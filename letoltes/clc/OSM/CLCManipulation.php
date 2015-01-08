<?php

class CLCManipulation {
    
    public static function mergeByCLCID(&$origRels, $clcRels, $addFixmeTags){
        //indexing by CLC:id
        $origRelsByCLCID = array();
        foreach ($origRels as $rel){
            $tags = $rel->tags;
            if (array_key_exists('CLC:id', $tags)){
                $origRelsByCLCID[$tags['CLC:id']] = $rel;
            }
        }
        
        //merge
        foreach ($clcRels as $clcRel){
            $tags = $clcRel->tags;            
            $clc_id = $tags['CLC:id'];
            if (array_key_exists($clc_id, $origRelsByCLCID)){
                $origRel = $origRelsByCLCID[$clc_id];
                foreach ($clcRel->members as $clcMember){
                    //$origRel->addMember($clcMember);
                    $origRel->members[] = $clcMember;
                }                
                //add fixme=unchecked for merged relation if enabled
                if($addFixmeTags){
                    //$origRel->addTag('fixme','unchecked');
                    $origRel->tags['fixme']='unchecked';
                    //$origRel->addTag('test1','test2');
                }
            }
            else{
                $origRels[$clc_id] = $clcRel;
            }
        }
    }
}

?>
