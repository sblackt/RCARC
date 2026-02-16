<?php
// Fetch YouTube videos via RSS feed - no API key needed!
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

define('YOUTUBE_CHANNEL_ID', 'UCBSBpalG59lY1UdUSVvIJkg');

$maxResults = isset($_GET['maxResults']) ? intval($_GET['maxResults']) : 12;
$maxResults = min($maxResults, 50);

// YouTube RSS feed URL
$rssUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" . YOUTUBE_CHANNEL_ID;

// Fetch RSS feed
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $rssUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$xmlData = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($xmlData === false || $httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch YouTube RSS feed']);
    exit;
}

// Parse XML
$xml = simplexml_load_string($xmlData);
if ($xml === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse RSS feed']);
    exit;
}

// Register namespaces
$namespaces = $xml->getNamespaces(true);

// Convert to format similar to YouTube API
$items = [];
$count = 0;

foreach ($xml->entry as $entry) {
    if ($count >= $maxResults) break;

    $media = $entry->children($namespaces['media']);
    $yt = $entry->children($namespaces['yt']);

    // Extract video ID from video URL
    $videoId = (string)$yt->videoId;

    $items[] = [
        'id' => [
            'videoId' => $videoId
        ],
        'snippet' => [
            'title' => (string)$entry->title,
            'description' => (string)$media->group->description,
            'publishedAt' => (string)$entry->published,
            'thumbnails' => [
                'medium' => [
                    'url' => (string)$media->group->thumbnail->attributes()['url']
                ]
            ]
        ]
    ];

    $count++;
}

// Return in similar format to YouTube API
echo json_encode([
    'items' => $items
]);
