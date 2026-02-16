<?php
// Diagnostic version to see what's wrong
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

// Test 1: Basic PHP works
$tests = ['basic' => 'PHP is working'];

// Test 2: cURL available?
$tests['curl_available'] = function_exists('curl_init') ? 'Yes' : 'No';

// Test 3: Try a simple cURL request
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAtNIp9P7AsGDUu6dwDJfhS5MsrNjoxQnQ&channelId=UCBSBpalG59lY1UdUSVvIJkg&part=snippet,id&order=date&maxResults=1&type=video");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    $tests['curl_http_code'] = $httpCode;
    $tests['curl_error'] = $error ? $error : 'None';
    $tests['response_length'] = strlen($response);
    $tests['response_preview'] = substr($response, 0, 100);
}

echo json_encode($tests, JSON_PRETTY_PRINT);
