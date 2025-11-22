<?php
session_start();

header('Content-type: application/json');

$url = 'http://backend:5000/app/get-products';

$cURL = curl_init($url);

curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);

curl_setopt($cURL, CURLOPT_HTTPGET, true);

$response = curl_exec($cURL);
$httpCode = curl_getinfo($cURL, CURLINFO_HTTP_CODE);


if ($httpCode != 200) {
    $response_user = ['success' => false];
    $response_user = json_encode($response_user);
    echo $response_user;
} else {
    echo json_encode($response);
}

 
