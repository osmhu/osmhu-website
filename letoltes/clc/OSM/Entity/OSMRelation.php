<?php
/**
 * Description of OSMRelation
 *
 * @author Csati
 */

include_once 'OSMBase.php';
include_once 'OSMKeys.php';
include_once 'OSMRelationMember.php';

class OSMRelation extends OSMBase{
    public $members = array();

    public function getType() {
        return OSMKeys::TYPE_RELATION;
    }
    
    public function parseFromSimpleXML($element) { 
        parent::parseFromSimpleXML($element);        
        foreach ($element->member as $member){
            $tmpMember = new OSMRelationMember($member[OSMKeys::ATTRIBUTE_TYPE],
                                               $member[OSMKeys::ATTRIBUTE_REFERENCE],
                                               $member[OSMKeys::ATTRIBUTE_ROLE]);
            $this->members[] = $tmpMember;
        }
    }
    
    public function toDomElement($domDoc) {
        $result = parent::toDomElement($domDoc);
        foreach ($this->members as $member){
            $tmpMember = $domDoc->createElement(OSMKeys::TYPE_MEMBER);
            $tmpMember->setAttribute(OSMKeys::ATTRIBUTE_TYPE,$member->type);
            $tmpMember->setAttribute(OSMKeys::ATTRIBUTE_REFERENCE,$member->ref);
            $tmpMember->setAttribute(OSMKeys::ATTRIBUTE_ROLE,$member->role);
            $result->appendChild($tmpMember);
        }        
        return $result;
    }
}

?>
