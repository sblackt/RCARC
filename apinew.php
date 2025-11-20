<?php
header('Content-Type: application/json');

// Simple file-based storage
$dataFile = 'events.json';

// Default error response
$response = ['success' => false];

// Function to read all events
function readEvents() {
    global $dataFile;
    if (file_exists($dataFile)) {
        $jsonData = file_get_contents($dataFile);
        return json_decode($jsonData, true) ?: [];
    }
    return [];
}

// Function to write all events
function writeEvents($events) {
    global $dataFile;
    $jsonData = json_encode($events, JSON_PRETTY_PRINT);
    return file_put_contents($dataFile, $jsonData) !== false;
}

// Handle GET request - retrieve all events
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $events = readEvents();
    echo json_encode($events);
    exit;
}

// Handle POST request - create new event
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
        exit;
    }
    
    $events = readEvents();
    
    // Generate a new ID
    $maxId = 0;
    foreach ($events as $event) {
        $maxId = max($maxId, $event['id']);
    }
    $data['id'] = $maxId + 1;
    
    // Add required fields
    $data['type'] = $data['type'] ?? '';
    $data['name'] = $data['name'] ?? '';
    $data['date'] = $data['date'] ?? '';
    $data['time'] = $data['time'] ?? '';
    $data['location'] = $data['location'] ?? '';
    $data['topic'] = $data['topic'] ?? '';
    
    // Add the new event
    $events[] = $data;
    
    if (writeEvents($events)) {
        $response = ['success' => true, 'id' => $data['id']];
    }
    
    echo json_encode($response);
    exit;
}

// Handle PUT request - update existing event
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid data or missing ID']);
        exit;
    }
    
    $events = readEvents();
    $updated = false;
    
    foreach ($events as &$event) {
        if ($event['id'] == $data['id']) {
            $event = array_merge($event, $data);
            $updated = true;
            break;
        }
    }
    
    if ($updated && writeEvents($events)) {
        $response = ['success' => true];
    } else {
        $response = ['success' => false, 'message' => 'Event not found'];
    }
    
    echo json_encode($response);
    exit;
}

// Handle DELETE request - delete event
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Missing ID']);
        exit;
    }
    
    $events = readEvents();
    $initialCount = count($events);
    
    $events = array_filter($events, function($event) use ($id) {
        return $event['id'] != $id;
    });
    
    if (count($events) < $initialCount && writeEvents($events)) {
        $response = ['success' => true];
    } else {
        $response = ['success' => false, 'message' => 'Event not found'];
    }
    
    echo json_encode($response);
    exit;
}

// If we get here, it's an unsupported method
echo json_encode(['success' => false, 'message' => 'Unsupported method']);
?>