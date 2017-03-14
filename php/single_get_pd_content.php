<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

/*获取传递得参数*/
$sex = $_REQUEST['sex'];
$pid = $_REQUEST['pid'];

$db_name = $sex.'_pd_content';  /*拼接表名*/

$sql = "select * from $db_name WHERE productId='$pid'";
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_all($result,MYSQLI_ASSOC);
//返回json数据
if($list != null){
    echo json_encode($list);
}else{
    echo "数据库中不存在此数据";
}
