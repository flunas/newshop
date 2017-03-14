<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

$uname = $_REQUEST['uname'];

$sql = "select uid from user where uname='$uname'";
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_row($result);
$output = [];
if($list){
    $output['msg'] = 'ok';
}else{
    $output['msg'] = 'no';
}

echo json_encode($output);


