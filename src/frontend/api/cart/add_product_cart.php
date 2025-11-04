<?php

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$data = [
    'gmail' => $_SESSION['gmail'],
    'product_id' => $data['id'],
    'qtd' => $data['qtd']
];

$data = json_encode($data);

$url = 'https://api.singlotown.com.br/cart/add';

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
    $response = json_decode($response, true);
    $response_user = ['success' => true,];
    $response_user = json_encode($response_user);
    echo $response_user;
}

curl_close($cURL);
