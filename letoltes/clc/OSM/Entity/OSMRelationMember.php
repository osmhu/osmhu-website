<?php
class OSMRelationMember {
    public $type;
    public $ref;
    public $role;
    
    public function __construct($type = NULL, $ref=NULL, $role="") {
        $this->type = $type;
        $this->ref = $ref;
        $this->role = $role;
    }
}

?>
