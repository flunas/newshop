<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

$tableName = $_REQUEST['tableName'];

$sql = "select table_name from information_schema.tables WHERE table_name='$tableName'";
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_row($result);
$output = [];
if($list){
    $output['msg'] = 'ok';
}else{
    $output['msg'] = 'no';
}

echo json_encode($output);