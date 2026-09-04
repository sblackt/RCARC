<?php

header('Content-Type: application/json');

require_once __DIR__ . '/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

logoutAdmin();

echo json_encode([
  'authenticated' => false
]);
