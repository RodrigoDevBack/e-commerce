<?php
session_start();
header('Content-type: application/json');

session_destroy();
echo 'exit';
exit;

