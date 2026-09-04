<?php

$config = require __DIR__ . '/config.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
  session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict',
    'use_strict_mode' => true,
  ]);
}

function isAdmin(): bool
{
  return !empty($_SESSION['rcarc_admin']);
}

function requireAdmin(): void
{
  if (!isAdmin()) {
    http_response_code(401);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Authentication required']);
    exit;
  }
}

function loginAdmin(string $password): bool
{
  global $config;

  $hash = $config['admin_password_hash'] ?? '';

  if ($hash === '' || !password_verify($password, $hash)) {
    return false;
  }

  session_regenerate_id(true);
  $_SESSION['rcarc_admin'] = true;
  $_SESSION['rcarc_last_activity'] = time();

  return true;
}

function logoutAdmin(): void
{
  $_SESSION = [];

  if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();

    setcookie(
      session_name(),
      '',
      time() - 42000,
      $params['path'],
      $params['domain'],
      $params['secure'],
      $params['httponly']
    );
  }

  session_destroy();
}

/* Expire admin sessions after 30 minutes of inactivity. */
$sessionTimeout = 1800;

if (
  isAdmin() &&
  isset($_SESSION['rcarc_last_activity']) &&
  time() - $_SESSION['rcarc_last_activity'] > $sessionTimeout
) {
  logoutAdmin();
} elseif (isAdmin()) {
  $_SESSION['rcarc_last_activity'] = time();
}
