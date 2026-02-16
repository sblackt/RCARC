<?php
// Secure YouTube API proxy endpoint
// This keeps the API key server-side and hidden from client code

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Store your YouTube API key here (server-side only)
define('YOUTUBE_API_KEY', 'AIzaSyAtNIp9P7AsGDUu6dwDJfhS5MsrNjoxQnQ');
define('YOUTUBE_CHANNEL_ID', 'UCBSBpalG59lY1UdUSVvIJkg');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get parameters from request
$maxResults = isset($_GET['maxResults']) ? intval($_GET['maxResults']) : 12;
$maxResults = min($maxResults, 50); // Cap at 50 for safety

// Build YouTube API URL
$params = http_build_query([
    'key' => YOUTUBE_API_KEY,
    'channelId' => YOUTUBE_CHANNEL_ID,
    'part' => 'snippet,id',
    'order' => 'date',
    'maxResults' => $maxResults,
    'type' => 'video'
]);

$url = "https://www.googleapis.com/youtube/v3/search?{$params}";

// Fetch from YouTube API using cURL (more compatible than file_get_contents)
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_REFERER, 'https://rcarc.ca/');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch YouTube data', 'details' => $error, 'http_code' => $httpCode]);
    exit;
}

// Return the YouTube API response (even if not 200, let the client handle it)
http_response_code($httpCode);
echo $response;
