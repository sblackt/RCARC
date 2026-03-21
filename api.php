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

function validateEventData($data) {
    $validTypes = ['breakfast', 'meeting', 'techie', 'special'];
    $errors = [];

    if (empty($data['name'])) $errors[] = 'name is required';
    if (empty($data['date'])) {
        $errors[] = 'date is required';
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])) {
        $errors[] = 'date must be in YYYY-MM-DD format';
    }
    if (empty($data['time'])) $errors[] = 'time is required';
    if (empty($data['location'])) $errors[] = 'location is required';
    if (empty($data['type'])) {
        $errors[] = 'type is required';
    } elseif (!in_array($data['type'], $validTypes)) {
        $errors[] = 'type must be one of: ' . implode(', ', $validTypes);
    }

    return $errors;
}

if ($method === 'GET') {
    // No changes needed here, the query will return special events as well
    $stmt = $pdo->query("SELECT * FROM events ORDER BY date ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $errors = validateEventData($data);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => implode('; ', $errors)]);
        exit;
    }
    $stmt = $pdo->prepare("INSERT INTO events (type, name, date, time, location, topic, details, presenter, link)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['type'], 
        $data['name'], 
        $data['date'], 
        $data['time'], 
        $data['location'], 
        $data['topic'] ?? null,
        $data['details'] ?? null,
        $data['presenter'] ?? null,
        $data['link'] ?? null
    ]);
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $errors = validateEventData($data);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['error' => implode('; ', $errors)]);
        exit;
    }
    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'id is required']);
        exit;
    }
    $stmt = $pdo->prepare("UPDATE events SET type=?, name=?, date=?, time=?, location=?, topic=?,
                          details=?, presenter=?, link=? WHERE id=?");
    $stmt->execute([
        $data['type'], 
        $data['name'], 
        $data['date'], 
        $data['time'], 
        $data['location'], 
        $data['topic'] ?? null,
        $data['details'] ?? null,
        $data['presenter'] ?? null,
        $data['link'] ?? null,
        $data['id']
    ]);
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