<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

$sid = $_REQUEST['sid'];
$userName = $_REQUEST['userName'];
$tableName = $userName.'_cart';
$sql = "DELETE FROM $tableName WHERE (sid='$sid')";
$result = mysqli_query($conn,$sql);
$output = [];
if($result){
    $output['msg'] = 'rmOk';
}else{
    $output['msg'] = 'rmErr';
}
echo json_encode($output);















