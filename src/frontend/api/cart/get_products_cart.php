<?php
session_start();

header('Content-type: application/json');
$data = $_SESSION['gmail'];

$data = [
    'gmail' => $data
];

$data = json_encode($data);

$url = 'http://backend:5000/cart/get';

$cURL = curl_init($url);

curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);

curl_setopt($cURL, CURLOPT_POST, true);

curl_setopt($cURL, CURLOPT_POSTFIELDS, $data);

curl_setopt($cURL, CURLOPT_HTTPHEADER, [ 
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data),
    'Authorization: Bearer ' . ($_SESSION['token'] ?? '')
]);

$response = curl_exec($cURL);
$httpCode = curl_getinfo($cURL, CURLINFO_HTTP_CODE);


if ($httpCode != 200) {
    $response_user = ['success' => false];
    $response_user = json_encode($response_user);
    echo $response_user;
} else {
    echo $response;
}

curl_close($cURL);
