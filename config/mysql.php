<?php

require_once 'config.php';
require_once 'MDB2.php';

function connect_mysql() {
    $dsn = array (
        'phptype'  => 'mysql',
        'username' => DB_USERNAME,
        'password' => DB_PASSWORD,
        'hostspec' => DB_HOST,
        'database' => DB_DATABASE
    );

    $mdb2 = MDB2::factory($dsn);

    if (is_a($mdb2, 'MDB2_Error')) {
        die('MySQL connect error: ' . $mdb2->getMessage());
    }

    $mdb2->loadModule('Extended');
    $mdb2->exec('SET NAMES UTF8');

    return $mdb2;
}
