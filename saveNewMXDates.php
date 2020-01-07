<?php
require_once 'login.php';
$str_json = file_get_contents('php://input');
$string =  json_decode($str_json);
$conn = new mysqli($hn, $un, $pw, $db);
if ($conn->connect_error) die("Failure");
$doubledate = date("Y-m-d H:i:s", strtotime($string[2].'+14 day'));
$doubledateTwo = date("Y-m-d H:i:s", strtotime($string[3].'+28 day'));

for($y = 2; $y<10; $y++){
    $cleanedDate = strtotime($string[$y]);
    $cleanedDate = date("Y-m-d H:i:s", $cleanedDate);
    $string[$y] = $cleanedDate;
}


$sql = "DELETE FROM BUNOMXDATES WHERE BUNO = '$string[0]'";
mysqli_query($conn, $sql);
$sql = "INSERT INTO BUNOMXDates (BUNO, squadronName,14day, 28day, 84day, 112day, 168day, 336day, 365day, 728day, 14day2, 28day2) VALUES ('$string[0]','$string[1]','$string[2]','$string[3]','$string[4]','$string[5]','$string[6]','$string[7]','$string[8]','$string[9]','$doubledate','$doubledateTwo')";
mysqli_query($conn, $sql);
//$sql = "INSERT INTO BUNOMXDATES(14day2, 28day2) VALUES('$doubledate','$doubledateTwo')";
//mysqli_query($conn, $sql);


$output = mysqli_error($conn);
echo json_encode($output);
