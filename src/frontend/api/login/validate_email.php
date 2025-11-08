<?php
session_start();

header('Content-type: application/json');
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$data = [
    'email' => $data['email'],
    'secret_code' => $data['code']
];

$data = json_encode($data);

$url = 'http://backend:5000/user/validate_email';

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
    $response_user = ['success' => true,];
    $response_user = json_encode($response_user);
    echo $response_user;
}

curl_close($cURL);
