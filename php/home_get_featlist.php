<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

$sql = "select * from feat_product";
$result = mysqli_query($conn,$sql);

$list = mysqli_fetch_all($result,MYSQLI_ASSOC);

//返回json数据
echo json_encode($list);























