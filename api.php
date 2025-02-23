<?php
header('Content-Type: application/json');

$host = 'localhost'; // Change if needed
$dbname = 'rcarc_event_manager';
$user = 'rcarc_admin';
$pass = 'thisisthercarcpassword';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM events ORDER BY date ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("INSERT INTO events (type, name, date, time, location, topic) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['type'], $data['name'], $data['date'], $data['time'], $data['location'], $data['topic'] ?? null]);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("UPDATE events SET type=?, name=?, date=?, time=?, location=?, topic=? WHERE id=?");
    $stmt->execute([$data['type'], $data['name'], $data['date'], $data['time'], $data['location'], $data['topic'] ?? null, $data['id']]);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("DELETE FROM events WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
