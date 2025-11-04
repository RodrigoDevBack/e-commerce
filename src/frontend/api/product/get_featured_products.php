<?php
session_start();

header('Content-type: application/json');

$url = 'https://api.singlotown.com.br/app/get-featured-products';

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

curl_close($cURL);
