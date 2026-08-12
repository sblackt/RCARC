<?php
// One-time migration: creates photo_categories/photos tables and seeds them
// from gallery-config.json. Safe to re-run (uses IF NOT EXISTS / ON DUPLICATE).
// Run via: php migrate-gallery.php

$host = 'localhost';
$dbname = 'rcarc_event_manager';
$user = 'rcarc_admin';
$pass = 'thisisthercarcpassword';

$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec("CREATE TABLE IF NOT EXISTS photo_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(64) UNIQUE NOT NULL,
    label VARCHAR(100) NOT NULL,
    description VARCHAR(255)
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    category_id INT NOT NULL,
    caption VARCHAR(255),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES photo_categories(id)
)");

$config = json_decode(file_get_contents(__DIR__ . '/gallery-config.json'), true);
if (!$config) {
    fwrite(STDERR, "Could not read/parse gallery-config.json\n");
    exit(1);
}

$insertCategory = $pdo->prepare(
    "INSERT INTO photo_categories (slug, label, description) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE label = VALUES(label), description = VALUES(description)"
);
foreach ($config['categories'] as $cat) {
    $insertCategory->execute([$cat['id'], $cat['label'], $cat['description'] ?? null]);
}

$categoryIds = [];
foreach ($pdo->query("SELECT id, slug FROM photo_categories") as $row) {
    $categoryIds[$row['slug']] = $row['id'];
}

$existing = $pdo->query("SELECT filename FROM photos")->fetchAll(PDO::FETCH_COLUMN);
$existingSet = array_flip($existing);

$insertPhoto = $pdo->prepare(
    "INSERT INTO photos (filename, original_filename, category_id) VALUES (?, ?, ?)"
);

$inserted = 0;
$skipped = 0;
foreach ($config['images'] as $filename => $meta) {
    if (isset($existingSet[$filename])) {
        $skipped++;
        continue;
    }
    $slug = $meta['category'];
    if (!isset($categoryIds[$slug])) {
        fwrite(STDERR, "Skipping $filename: unknown category '$slug'\n");
        continue;
    }
    $insertPhoto->execute([$filename, $filename, $categoryIds[$slug]]);
    $inserted++;
}

echo "Categories: " . count($categoryIds) . "\n";
echo "Photos inserted: $inserted, skipped (already present): $skipped\n";
