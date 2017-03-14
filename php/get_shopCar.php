<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

$userName = $_REQUEST['userName'];

/*判断是否存在用户购物车表*/
$tableName = $userName.'_cart';
$sql = "select table_name from information_schema.tables WHERE table_name='$tableName'";
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_row($result);
$output = [];
if($list){  //如果存在，则读取数据
//    $output['msg'] = $userName;
    $sql = "select * from $tableName where userName='$userName'";
    $result = mysqli_query($conn,$sql);
    $list = mysqli_fetch_all($result,MYSQLI_ASSOC);
    if($list){
        $output['obj'] = $list;
    }else{
        $output['msg'] = 'noData';
    }
}else{  //如果不存在，则创建
    $output['msg'] = 'noTable';
    $sql = "CREATE TABLE $tableName (
      sid INT PRIMARY KEY AUTO_INCREMENT,
      sData VARCHAR(1024),
      userName VARCHAR(32),
      number VARCHAR(32)
    )";
    $result = mysqli_query($conn,$sql);
    if($result){
        $output['msg2'] = '用户数据表已建成';
    }
}




echo json_encode($output);



