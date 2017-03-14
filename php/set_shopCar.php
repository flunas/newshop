<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

$userName = $_REQUEST['userName'];
$sData = $_REQUEST['sData'];
$output = [];

//拼接表名
$tableName = $userName.'_cart';
//查询数据库中是否已存在相同的，如果存在，则返回sid和number
    $sql = "select sid,number from $tableName where sData='$sData'";
    $result = mysqli_query($conn, $sql);
    $list = mysqli_fetch_array($result, MYSQLI_ASSOC);
    $sid = $list['sid'];
    $number = $list['number'] + 1;

    if ($list) { //如果记录已存在，则number加1
        $sql = "UPDATE $tableName SET number='$number' WHERE (sid='$sid')";
        $result = mysqli_query($conn, $sql);
        $output['msg'] = 'upData';
    } else {  //否则新插入一条新纪录
        $sql = "insert into $tableName VALUES (NULL ,'$sData','$userName','1')";
        $result = mysqli_query($conn, $sql);
        $output['msg'] = 'newList';
    }
echo json_encode($output);

