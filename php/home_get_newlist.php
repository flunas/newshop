<?php
/**
 * Created by PhpStorm.
 * User: bjwsl-001
 * Date: 2016/11/24
 * Time: 15:11
 */
header('Content-Type:application/json;charset=utf8');
include('config.php');

$sql = "select * from new_product";
$result = mysqli_query($conn,$sql);

$list = mysqli_fetch_all($result,MYSQLI_ASSOC);

//返回json数据
echo json_encode($list);























