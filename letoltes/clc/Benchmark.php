<?php

function benchmark() {
    static $start = NULL;
    if( is_null($start) ) {
            $start = get_microtime();
    } else {
        $benchmark = get_microtime() - $start;
        $start = get_microtime();
        return $benchmark;
    }
}

function get_microtime() {
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}
?>
