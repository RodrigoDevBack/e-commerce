<?php
session_start();

header('Content-Type: application/json');

$data = [
    'id' => $_POST['id'],
    'name' => $_POST['name'] ?? null,
    'description' => $_POST['description'] ?? null,
    'qtd' => $_POST['qtd'] ?? null,
    'price' => $_POST['price'] ?? null,
];

$data = json_encode($data);

$url = 'https://api.singlotown.com.br/admin/edit-product';

$cURL = curl_init($url);

curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);

curl_setopt($cURL, CURLOPT_CUSTOMREQUEST, 'PUT');

curl_setopt($cURL, CURLOPT_POSTFIELDS, $data);

curl_setopt($cURL, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Context-Length: '. strlen($data),
    'Authorization: Bearer ' . ($_SESSION['token'] ?? ''),
]);

$response = curl_exec($cURL);
$httpCode = curl_getinfo($cURL, CURLINFO_HTTP_CODE);
curl_close($cURL);


if ($httpCode !== 200) {
    echo json_encode(['success' => false]);
} else{
    echo json_encode(['success' => true]);
}

$dataImage = [];

$images = [];
if (isset($_POST['del_images'])) {
    foreach ($_POST['del_images'] as $i) {
        $del_image['id'] = $_POST['id'];
        $del_image['del_image'] = $i;

        $url = 'https://api.singlotown.com.br/admin/delete-product-image';

        $cURL = curl_init($url);
        
        curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);

        curl_setopt($cURL, CURLOPT_CUSTOMREQUEST, 'PATCH');

        curl_setopt($cURL, CURLOPT_POSTFIELDS, $del_image);

        curl_setopt($cURL, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . ($_SESSION['token'] ?? ''),
        ]);

        $response_image = curl_exec($cURL);
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

            $url = 'https://api.singlotown.com.br/admin/add-product-image';

            $cURL = curl_init($url);

            curl_setopt($cURL, CURLOPT_RETURNTRANSFER, true);

            curl_setopt($cURL, CURLOPT_POST, true);

            curl_setopt($cURL, CURLOPT_POSTFIELDS, $dataImage);

            curl_setopt($cURL, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . ($_SESSION['token'] ?? ''),
            ]);

            $response_image = curl_exec($cURL);
            curl_close($cURL);
            }
        }
}
