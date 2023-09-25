<?php

// MySQL connection details
define('DB_HOST', isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : '127.0.0.1');
define('DB_USERNAME', 'osmhu');
define('DB_PASSWORD', 'Eidoh5zo');
define('DB_DATABASE', 'osm_hu');

// PostgreSQL connection details
define('PGSQL_HOST', isset($_ENV['PGSQL_HOST']) ? $_ENV['PGSQL_HOST'] : '127.0.0.1');
define('PGSQL_USERNAME', 'osmhu');
define('PGSQL_PASSWORD', 'Eidoh5zo');
define('PGSQL_DATABASE', 'gis');
