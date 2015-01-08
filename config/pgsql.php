<?php

require_once 'config.php';
require_once 'MDB2.php';

function connect_pgsql() {
    $dsn = array (
        'phptype'  => 'pgsql',
        'username' => PGSQL_USERNAME,
        'password' => PGSQL_PASSWORD,
        'hostspec' => PGSQL_HOST,
        'database' => PGSQL_DATABASE
    );

    $mdb2 = MDB2::factory($dsn);

    if (is_a($mdb2, 'MDB2_Error')) {
        die('PostgreSQL connect error: ' . $mdb2->getMessage());
    }

    $mdb2->loadModule('Extended');

    return $mdb2;
}
