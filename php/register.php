<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

$user = $_REQUEST['user'];
$uname = $user['uname'];
$upwd = $user['upwd'];
$email = $user['email'];

$sql = "INSERT INTO user VALUES (NULL ,'$uname', '$upwd', '$email', '', '')";
$result = mysqli_query($conn,$sql);
$output = [];
if($result){
    $output['msg'] = 'succ';
    $output['obj'] = $user;
}else{
    $output['msg'] = 'err';
}
echo json_encode($output);





