<?php
session_start();

$data = [
    'id' => $_POST['id'],
    'name' => $_POST['name'] ?? null,
    'description' => $_POST['description'] ?? null,
    'qtd' => $_POST['qtd'] ?? null,
    'price' => $_POST['price'] ?? null,
];


$url = 'http://backend:5000/admin/edit-product';

$cURL = curl_init($url);
curl_setopt_array($cURL, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "PUT",
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
if (isset($_POST['del_images'])) {
    foreach ($_POST['del_images'] as $i) {
        $del_image['id'] = $_POST['id'];
        $del_image['del_image'] = $i;

        $url = 'http://backend:5000/admin/delete-product-image';

        $cURL = curl_init($url);
        curl_setopt_array($cURL, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'PATCH',
            CURLOPT_POSTFIELDS => $del_image,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . ($_SESSION['token'] ?? ''),
            ],
        ]);

        $response_image = curl_exec($cURL);
        $httpCode = curl_getinfo($cURL, CURLINFO_HTTP_CODE);
        curl_close($cURL);
    }
}
if (isset($_FILES['images'])) {
    foreach ($_FILES['images']['tmp_name'] as $i => $tmpName) {
        if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {

            $dataImage["image"] = new CURLFile(
                $_FILES['images']['tmp_name'][$i],
                $_FILES['images']['type'][$i],
                $_FILES['images']['name'][$i]
            );

            $dataImage['id'] = $_POST['id'];

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
