<?php

$localConfigFile = __DIR__ . '/config.local.php';

if (file_exists($localConfigFile)) {
    return require $localConfigFile;
}

return [
    'db_host' => getenv('RCARC_DB_HOST') ?: 'localhost',
    'db_name' => getenv('RCARC_DB_NAME') ?: '',
    'db_user' => getenv('RCARC_DB_USER') ?: '',
    'db_pass' => getenv('RCARC_DB_PASS') ?: '',
    'environment' => getenv('RCARC_ENV') ?: 'production',
];
