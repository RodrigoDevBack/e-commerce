<?php
session_start();

$data = [
    'name' => $_POST['name'] ?? '',
    'description' => $_POST['description'] ?? '',
    'qtd' => $_POST['qtd'] ?? '',
    'price' => $_POST['price'] ?? '',
];


$url = 'http://backend:5000/admin/create-product';

$cURL = curl_init($url);
curl_setopt_array($cURL, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json', 
        'Context-Length: '. strlen(json_encode($data)),
        'Authorization: Bearer ' . ($_SESSION['token'] ?? ''),
    ],
]);

$response = curl_exec($cURL);
$httpCode = curl_getinfo($cURL, CURLINFO_HTTP_CODE);
curl_close($cURL);

header('Content-Type: application/json');

if ($httpCode !== 200) {
    echo json_encode(['success' => false, 'status' => $httpCode, 'response' => $response]);
} else{
    echo json_encode(['success' => true, 'response' => $response]);
}

$dataImage = [];

$images = [];

if (isset($_FILES['images'])) {
    foreach ($_FILES['images']['tmp_name'] as $i => $tmpName) {
        if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {

            $dataImage["image"] = new CURLFile(
                $_FILES['images']['tmp_name'][$i],
                $_FILES['images']['type'][$i],
                $_FILES['images']['name'][$i]
            );

            $dataImage['id'] = json_decode($response, true)['id'];

            $url = 'http://backend:5000/admin/add-product-image';

            $cURL = curl_init($url);
            curl_setopt_array($cURL, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $dataImage,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . ($_SESSION['token'] ?? ''),
                ],
            ]);

            $response_image = curl_exec($cURL);
            $httpCode = curl_getinfo($cURL, CURLINFO_HTTP_CODE);
            curl_close($cURL);
            }
        }
}

foreach ($images as $img) {
    
}
