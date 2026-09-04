<?php
header('Content-Type: application/json');

$config = require __DIR__ . '/config.php';

require_once __DIR__ . '/auth.php';

$host = $config['db_host'];
$dbname = $config['db_name'];
$user = $config['db_user'];
$pass = $config['db_pass'];

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
$uploadDir = $config['upload_dir'] ?? (__DIR__ . '/img/gallery/');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}


function slugify($label) {
    $slug = strtolower(trim($label));
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    return trim($slug, '-');
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $categories = $pdo->query("SELECT id, slug, label, description FROM photo_categories ORDER BY label")
        ->fetchAll(PDO::FETCH_ASSOC);

    $photos = $pdo->query(
        "SELECT p.id, p.filename, p.caption, c.slug AS category
         FROM photos p JOIN photo_categories c ON c.id = p.category_id
         ORDER BY p.uploaded_at DESC"
    )->fetchAll(PDO::FETCH_ASSOC);

    $images = [];
    foreach ($photos as $photo) {
        $images[$photo['filename']] = [
            'id' => (int) $photo['id'],
            'category' => $photo['category'],
            'caption' => $photo['caption'],
        ];
    }

    echo json_encode([
        'categories' => array_map(function ($c) {
            return [
                'id' => $c['slug'],
                'db_id' => (int) $c['id'],
                'label' => $c['label'],
                'description' => $c['description'],
            ];
        }, $categories),
        'images' => $images,
    ]);
    exit;
}

if ($method === 'POST') {
    requireAdmin();
    requireCsrf();
    // Creating a new category (no file attached)
    if (isset($_POST['action']) && $_POST['action'] === 'create_category') {
        $label = trim($_POST['label'] ?? '');
        if ($label === '') {
            http_response_code(400);
            echo json_encode(['error' => 'label is required']);
            exit;
        }
        $slug = slugify($label);
        if ($slug === '') {
            http_response_code(400);
            echo json_encode(['error' => 'label must contain letters or numbers']);
            exit;
        }
        $stmt = $pdo->prepare(
            "INSERT INTO photo_categories (slug, label, description) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE label = VALUES(label)"
        );
        $stmt->execute([$slug, $label, $_POST['description'] ?? null]);
        echo json_encode(['success' => true, 'slug' => $slug]);
        exit;
    }

    // Uploading a photo
    if (empty($_FILES['photo'])) {
        http_response_code(400);
        echo json_encode(['error' => 'photo file is required']);
        exit;
    }
    if ($_FILES['photo']['error'] === UPLOAD_ERR_INI_SIZE || $_FILES['photo']['error'] === UPLOAD_ERR_FORM_SIZE) {
        http_response_code(400);
        echo json_encode(['error' => 'File is too large for the server to accept']);
        exit;
    }
    if ($_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Upload failed, please try again']);
        exit;
    }

    $file = $_FILES['photo'];

    if ($file['size'] > MAX_FILE_BYTES) {
        http_response_code(400);
        echo json_encode(['error' => 'File exceeds the 10MB limit']);
        exit;
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ALLOWED_EXTENSIONS, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Unsupported file type']);
        exit;
    }

    // Reject anything that isn't actually a decodable image (blocks a renamed .php etc.)
    $imageInfo = @getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        http_response_code(400);
        echo json_encode(['error' => 'File is not a valid image']);
        exit;
    }

    // Resolve the category: either an existing category_id, or a brand-new label
    $categoryId = null;
    if (!empty($_POST['new_category_label'])) {
        $label = trim($_POST['new_category_label']);
        $slug = slugify($label);
        if ($slug === '') {
            http_response_code(400);
            echo json_encode(['error' => 'new_category_label must contain letters or numbers']);
            exit;
        }
        $stmt = $pdo->prepare(
            "INSERT INTO photo_categories (slug, label) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE label = VALUES(label)"
        );
        $stmt->execute([$slug, $label]);
        $categoryId = (int) $pdo->query(
            "SELECT id FROM photo_categories WHERE slug = " . $pdo->quote($slug)
        )->fetchColumn();
    } elseif (!empty($_POST['category_id'])) {
        $categoryId = (int) $_POST['category_id'];
    }

    if (!$categoryId) {
        http_response_code(400);
        echo json_encode(['error' => 'category_id or new_category_label is required']);
        exit;
    }

    $storedFilename = bin2hex(random_bytes(8)) . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $storedFilename)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save uploaded file']);
        exit;
    }

    $stmt = $pdo->prepare(
        "INSERT INTO photos (filename, original_filename, category_id, caption) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$storedFilename, $file['name'], $categoryId, $_POST['caption'] ?? null]);

    echo json_encode(['success' => true, 'filename' => $storedFilename, 'id' => (int) $pdo->lastInsertId()]);
    exit;
}

if ($method === 'PUT') {
    requireAdmin();
    requireCsrf();
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? 0;
    $categoryId = (int) ($data['category_id'] ?? 0);

    if (!$id || !$categoryId) {
        http_response_code(400);
        echo json_encode(['error' => 'id and category_id are required']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE photos SET category_id = ? WHERE id = ?");
    $stmt->execute([$categoryId, $id]);

    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE') {
    requireAdmin();
    requireCsrf();
    $id = $_GET['id'] ?? 0;

    if (($_GET['type'] ?? 'photo') === 'category') {
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM photos WHERE category_id = ?");
        $countStmt->execute([$id]);
        $count = (int) $countStmt->fetchColumn();
        if ($count > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Category still has photos assigned to it']);
            exit;
        }
        $pdo->prepare("DELETE FROM photo_categories WHERE id = ?")->execute([$id]);
        echo json_encode(['success' => true]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT filename FROM photos WHERE id = ?");
    $stmt->execute([$id]);
    $filename = $stmt->fetchColumn();

    if ($filename) {
        $pdo->prepare("DELETE FROM photos WHERE id = ?")->execute([$id]);
        $path = $uploadDir . $filename;
        if (is_file($path)) {
            unlink($path);
        }
    }

    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
