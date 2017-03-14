<?php
/**
 * Created by PhpStorm.
 * User: bjwsl-001
 * Date: 2016/11/23
 * Time: 14:56
 */
header('Content-Type:application/json;charset=utf8');
include('config.php');
$uname = $_REQUEST['uname'];
$upwd = $_REQUEST['upwd'];

$sql = "SELECT * FROM user WHERE uname='$uname' AND upwd='$upwd'";
$result = mysqli_query($conn,$sql);
//创建要输出给客户端的数据
$output = [];
if($result===false){//执行失败
    $output['msg'] = 'err';
    $output['sql'] = $sql;

}else {         //执行成功
    $row = mysqli_fetch_assoc($result);
    if($row){	//读取到一行记录
        $output['msg'] = 'succ';
        $output['obj'] = $row;
    }else{	//未读取到任何记录
        $output['msg'] = 'err';
    }
}


//把数据编码为JSON字符串
echo json_encode($output);
