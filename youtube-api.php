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

// Fetch from YouTube API
$response = @file_get_contents($url);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch YouTube data']);
    exit;
}

// Return the YouTube API response
echo $response;
