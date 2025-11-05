<?php
session_start();

header('Content-type: application/json');
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$data = [
    'username' => $data['username'],
    'password' => $data['password']
];

$url = 'http://backend:5000/user/login';

$cURL = curl_init($url);

curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);

curl_setopt($cURL, CURLOPT_POST, true);

curl_setopt($cURL, CURLOPT_POSTFIELDS, http_build_query($data));

curl_setopt($cURL, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded'
]);

$response = curl_exec($cURL);
$httpCode = curl_getinfo($cURL, CURLINFO_HTTP_CODE);


if ($httpCode != 200) {
    $response_user = ['success' => false];
    $response_user = json_encode($response_user);
    echo $response_user;
} else {
    $response = json_decode($response, true);
    
    $_SESSION['email'] = $data['username'];
    $_SESSION['token'] = $response['access_token'];
    $_SESSION['role'] = $response['role'];

    $response_user = [
        'success' => true,
        'name' => $response['name'],
        'role' => $response['role'],
        'email_validate' => $response['email_validate']
    ];
    $response_user = json_encode($response_user);
    echo $response_user;
}

curl_close($cURL);
