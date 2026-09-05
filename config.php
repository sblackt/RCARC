<?php

// Local development configuration.
// This file is gitignored and exists only on development machines.
// By which I mean my machine. Ash. If you want this file, let me know!
$localConfigFile = __DIR__ . '/config.local.php';

if (file_exists($localConfigFile)) {
    return require $localConfigFile;
}

// Production configuration lives outside the public web root.
// On production:
//   __DIR__            = /home/rcarc/public_html
//   dirname(__DIR__)   = /home/rcarc
$productionConfigFile = dirname(__DIR__) . '/rcarc-config.php';

if (file_exists($productionConfigFile)) {
    return require $productionConfigFile;
}

// Environment variables provide an additional deployment option.
return [
    'db_host' => getenv('RCARC_DB_HOST') ?: 'localhost',
    'db_name' => getenv('RCARC_DB_NAME') ?: '',
    'db_user' => getenv('RCARC_DB_USER') ?: '',
    'db_pass' => getenv('RCARC_DB_PASS') ?: '',
    'environment' => getenv('RCARC_ENV') ?: 'production',
    'admin_password_hash' => getenv('RCARC_ADMIN_PASSWORD_HASH') ?: '',
];
