<?php

header('Content-Type: application/json');

require_once __DIR__ . '/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $authenticated = isAdmin();

  echo json_encode([
    'authenticated' => $authenticated,
    'csrf_token' => $authenticated ? getCsrfToken() : null
  ]);
  exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$password = $data['password'] ?? '';

if (!loginAdmin($password)) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid password']);
    exit;
}
  echo json_encode([
    'authenticated' => true,
    'csrf_token' => getCsrfToken()
]);
