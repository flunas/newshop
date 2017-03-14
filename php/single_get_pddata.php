<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

$sex = $_REQUEST['sex'];
$pid = $_REQUEST['pid'];

$db_name = $sex.'_product';

$sql = "select * from $db_name WHERE sex='$sex' and pid='$pid'";
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_all($result,MYSQLI_ASSOC);
echo json_encode($list);