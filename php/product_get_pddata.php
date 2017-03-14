<?php
header('Content-Type:application/json;charset=utf8');
include('config.php');

/*获取传递得参数*/
$sex = $_REQUEST['sex'];
$type = $_REQUEST['type'];
$initPage = $_REQUEST['initPage'];  //接受传递过来的页数

$db_name = $sex.'_product';  /*拼接表名*/
//每一页显示的条数
$PageRow = 3;


$sql = "select count(*) as num from $db_name WHERE sex='$sex' and type='$type'";  //获取总记录数
$result = mysqli_query($conn,$sql);
$rs = mysqli_fetch_array($result);
$totalNumber = $rs[0];          //总记录数
$totalPage = ceil($totalNumber/$PageRow);    //计算总页数
$obj = [];
$obj['total'] = $totalPage;                         //添加到一个数组里面



//开始条数
$numStart = ($initPage-1)*$PageRow;

$sql = "select * from $db_name WHERE sex='$sex' and type='$type' limit $numStart,$PageRow";   //从哪里开始,多少条记录
$result = mysqli_query($conn,$sql);
$list = mysqli_fetch_all($result,MYSQLI_ASSOC);
$obj['list'] = $list;




//返回json数据
if($list != null){
    echo json_encode($obj);
}else{
    echo "数据库中不存在此数据";
}
