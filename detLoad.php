<?php
require_once 'login.php';

$str_json = file_get_contents('php://input');
$cleanData= json_decode($str_json);
//$cleanedBuno = $cleanData[0];
$cleanedDateStart = strtotime($cleanData[2]);
$cleanedDateStart = date("Y-m-d H:i:s", $cleanedDateStart);
$cleanedDateEnd = strtotime($cleanData[3]);
$cleanedDateEnd = date("Y-m-d H:i:s", $cleanedDateEnd);
$conn = new mysqli($hn, $un, $pw, $db);
if ($conn->connect_error) die("Failure");

$sql = "INSERT INTO detTable (BUNO,squadronName,dateDetStart,dateDetEnd,detLocation, detName) VALUES ('$cleanData[0]','$cleanData[1]', '$cleanedDateStart', '$cleanedDateEnd','$cleanData[4]','$cleanData[5]' ) ";

if (mysqli_query($conn, $sql)) {
    $output = "New record created successfully";
} else {
    $output= "Error: " . $sql . "" . mysqli_error($conn);
}
echo json_encode($output);
//mysqli_query($conn, $query)();
//mysqli_close($conn);




