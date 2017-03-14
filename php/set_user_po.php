<?php
header('Content-Type:application;charset=utf8');
include('config.php');

$userName = $_REQUEST['userName'];
$poData = $_REQUEST['poData'];
$totalPrice = $_REQUEST['totalPrice'];
$output = [];

//拼接表名
$tableName = $userName.'_po';
$tableCartName = $userName.'_cart';
//查询数据库中是否存在该用户的订单表
$sql = "select table_name from information_schema.tables WHERE table_name='$tableName'";
$result = mysqli_query($conn, $sql);
$list = mysqli_fetch_row($result);
$output = [];
if($list){  //如果存在，则写入新订单数据
    //查询数据库中是否已存在相同的，如果存在，则返回poid和number
    $sql = "select poid,number from $tableName where poData='$poData' and totalPrice='$totalPrice'";
    $result = mysqli_query($conn, $sql);
    $list = mysqli_fetch_array($result,MYSQLI_ASSOC);
    $poid = $list['poid'];
    $number = $list['number'] + 1;

    if ($list) { //如果记录已存在，则number加1
        $sql = "UPDATE $tableName SET number='$number' WHERE (poid='$poid')";
        $result = mysqli_query($conn, $sql);
        $output['msg'] = 'upData';
        //更新用户购物车
        $sql = "truncate table $tableCartName";
        mysqli_query($conn,$sql);
    } else {  //否则新插入一条新纪录
        $sql = "insert into $tableName VALUES (NULL ,'$poData','$totalPrice','$userName','1')";
        $result = mysqli_query($conn, $sql);
        $output['msg'] = 'newPOList';
        //更新用户购物车
        $sql = "truncate table $tableCartName";
        mysqli_query($conn,$sql);
    }
}else{  //如果不存在，则创建后再写入订单数据
    $sql = "CREATE TABLE $tableName (
      poid INT PRIMARY KEY AUTO_INCREMENT,
      poData VARCHAR(1024),
      totalPrice VARCHAR(32),
      userName VARCHAR(32),
      number VARCHAR(32)
    )";
    $result = mysqli_query($conn,$sql);
    if($result){
        $output['msg'] = '用户数据表已建成,正在写入数据……';
        $sql = "insert into $tableName VALUES (NULL ,'$poData','$totalPrice','$userName','1')";
        $result = mysqli_query($conn,$sql);
        if($result){
            $output['msg2'] = 'insert_ok';
            //更新用户购物车
            $sql = "truncate table $tableCartName";
            mysqli_query($conn,$sql);
        }else{
            $output['msg2'] = 'insert_err';
        }
    }else{
        $output['msg'] = '用户订单表创建失败！';
    }
}

echo json_encode($output);