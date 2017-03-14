set names utf8;
DROP database if EXISTS shop;
CREATE DATABASE shop CHARSET = utf8;
use shop;

/*创建用户表*/
DROP TABLE IF EXISTS user;

CREATE TABLE user(
  uid INT PRIMARY KEY auto_increment,
  uname VARCHAR (32),
  upwd VARCHAR (32),
  email VARCHAR (32),
  phoneNumber VARCHAR(32) ,
  address VARCHAR (128)
);


/*为用户表添加用户*/
INSERT INTO user VALUES
  (NULL ,'admin','admin','admin@qq.com','18512345678','大街小巷72号对面湖边柳树下街边尽头'),
  (NULL ,'root','root','root@qq.com','18512345678','大街小巷72号对面湖边柳树下街边尽头');


/*创建new_product表*/
DROP TABLE IF EXISTS new_product;
CREATE TABLE new_product(
  pid INT PRIMARY KEY AUTO_INCREMENT,
  pname VARCHAR(128),
  price VARCHAR(32),
  pic VARCHAR(32),
  pdate DATE,
  type VARCHAR(32)
);

/*为new_product添加数据*/
INSERT INTO new_product VALUES
  (NULL ,'contrary to popular','10','images/pi.jpg','2016.11.02','T-Shirt'),
  (NULL ,'CLASSICAL LATIN','20','images/pi1.jpg','2016.11.03','Shoe'),
  (NULL ,'UNDOUBTABLE','30','images/pi2.jpg','2016.11.04','Bag'),
  (NULL ,'SUFFERED ALTERATION','40','images/pi3.jpg','2016.11.05','Shirt'),
  (NULL ,'CONTENT HERE','50','images/pi4.jpg','2016.11.06','Bag'),
  (NULL ,'READABLE CONTENT','60','images/pi5.jpg','2016.11.07','Shoe');


/*创建feat_product表*/
DROP TABLE IF EXISTS feat_product;
CREATE TABLE feat_product(
  pid INT PRIMARY KEY AUTO_INCREMENT,
  pname VARCHAR(128),
  price VARCHAR(32),
  pic VARCHAR(32),
  pdate DATE,
  type VARCHAR(32)
);

/*为feat_product添加数据*/
INSERT INTO feat_product VALUES
  (NULL ,'contrary to popular','10','images/t1.jpg','2016.11.02','Lorem'),
  (NULL ,'CLASSICAL LATIN','20','images/t2.jpg','2016.11.03','Lorem'),
  (NULL ,'UNDOUBTABLE','30','images/t3.jpg','2016.11.04','Lorem'),
  (NULL ,'SUFFERED ALTERATION','40','images/t4.jpg','2016.11.05','Lorem');

/*考虑到今后数据库会很大，便将男女各建不同的表*/

/*创建男的数据表*/
DROP TABLE IF EXISTS men_product;       /*检查是否已存在同名数据表，有则删之*/
CREATE TABLE men_product(
  pid INT PRIMARY KEY AUTO_INCREMENT,   /*id*/
  pname VARCHAR(32),                    /*名字*/
  price INT,                    /*价格*/
  pic VARCHAR(32),                      /*图片*/
  ptips VARCHAR(128),                   /*提示、介绍*/
  pdate DATE,                           /*时间*/
  color VARCHAR(64),                    /*颜色*/
  size VARCHAR(32),                     /*大小*/
  sex VARCHAR(32),                      /*性别、使用人群*/
  type VARCHAR(32)                      /*类型*/
);

INSERT INTO men_product VALUES
  (NULL ,'南极人 2016秋冬新款男士加厚羽绒服','599','images/products/men/01/00.jpg','南极人 2016秋冬季新款男士加厚时尚羽绒服男中长款商务休闲连帽羽绒男 灰色 XL','2016.03.22','Blue/Black/Red','XL/XXL/M/L/XXXL','men','ssyr'),
  (NULL ,'红心黑色圆领短袖','200','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','ssyr'),
  (NULL ,'红心黑色圆领短袖','200','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','ssyr'),
  (NULL ,'红心黑色圆领短袖','300','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xsjk'),
  (NULL ,'红心黑色圆领短袖','300','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xsjk'),
  (NULL ,'红心黑色圆领短袖','300','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xsjk'),
  (NULL ,'红心黑色圆领短袖','400','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','nzk'),
  (NULL ,'红心黑色圆领短袖','400','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','nzk'),
  (NULL ,'红心黑色圆领短袖','400','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','nzk'),
  (NULL ,'红心黑色圆领短袖','500','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xxk'),
  (NULL ,'红心黑色圆领短袖','500','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xxk'),
  (NULL ,'红心黑色圆领短袖','500','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xxk'),
  (NULL ,'红心黑色圆领短袖','600','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xk'),
  (NULL ,'红心黑色圆领短袖','600','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xk'),
  (NULL ,'红心黑色圆领短袖','600','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','xk'),
  (NULL ,'红心黑色圆领短袖','700','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','jpcs'),
  (NULL ,'红心黑色圆领短袖','700','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','jpcs'),
  (NULL ,'红心黑色圆领短袖','700','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','jpcs'),
  (NULL ,'红心黑色圆领短袖','800','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','mndy'),
  (NULL ,'红心黑色圆领短袖','800','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','mndy'),
  (NULL ,'红心黑色圆领短袖','800','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','mndy'),
  (NULL ,'红心黑色圆领短袖','901','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','902','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','903','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','904','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','905','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','906','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','907','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','908','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','909','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','910','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','911','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','912','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','913','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','914','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy'),
  (NULL ,'红心黑色圆领短袖','915','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','men','clwy');

/*创建女的数据表*/
DROP TABLE IF EXISTS women_product;       /*检查是否已存在同名数据表，有则删之*/
CREATE TABLE women_product(
  pid INT PRIMARY KEY AUTO_INCREMENT,   /*id*/
  pname VARCHAR(32),                    /*名字*/
  price VARCHAR(32),                    /*价格*/
  pic VARCHAR(32),                      /*图片*/
  ptips VARCHAR(128),                   /*提示、介绍*/
  pdate DATE,                           /*时间*/
  color VARCHAR(64),                    /*颜色*/
  size VARCHAR(32),                     /*大小*/
  sex VARCHAR(32),                      /*性别、使用人群*/
  type VARCHAR(32)                      /*类型*/
);

INSERT INTO women_product VALUES
  (NULL ,'红心黑色圆领短袖','210','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','ssyr'),
  (NULL ,'红心黑色圆领短袖','210','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','ssyr'),
  (NULL ,'红心黑色圆领短袖','210','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','ssyr'),
  (NULL ,'红心黑色圆领短袖','310','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','qbyr'),
  (NULL ,'红心黑色圆领短袖','310','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','qbyr'),
  (NULL ,'红心黑色圆领短袖','310','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','qbyr'),
  (NULL ,'红心黑色圆领短袖','440','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','zzq'),
  (NULL ,'红心黑色圆领短袖','440','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','zzq'),
  (NULL ,'红心黑色圆领短袖','440','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','zzq'),
  (NULL ,'红心黑色圆领短袖','550','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','mndy'),
  (NULL ,'红心黑色圆领短袖','550','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','mndy'),
  (NULL ,'红心黑色圆领短袖','550','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','mndy'),
  (NULL ,'红心黑色圆领短袖','660','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','wnmf'),
  (NULL ,'红心黑色圆领短袖','660','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','wnmf'),
  (NULL ,'红心黑色圆领短袖','660','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','wnmf'),
  (NULL ,'红心黑色圆领短袖','770','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','zzs'),
  (NULL ,'红心黑色圆领短袖','770','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','zzs'),
  (NULL ,'红心黑色圆领短袖','770','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','zzs'),
  (NULL ,'红心黑色圆领短袖','880','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','jrwy'),
  (NULL ,'红心黑色圆领短袖','880','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','jrwy'),
  (NULL ,'红心黑色圆领短袖','880','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','jrwy'),
  (NULL ,'红心黑色圆领短袖','990','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','nzk'),
  (NULL ,'红心黑色圆领短袖','990','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','nzk'),
  (NULL ,'红心黑色圆领短袖','990','images/pi.jpg','红心黑色圆领短袖','2015.03.22','Blue/Black/Red','S/M/L/XL','women','nzk');

/*创建men_pd_pic    轮播图数据*/
DROP TABLE IF EXISTS men_pd_pic;
CREATE TABLE men_pd_pic (
  pid INT PRIMARY KEY AUTO_INCREMENT,
  purl VARCHAR(32),
  productId VARCHAR(32)
);

/*给men_pd_pic插入数据*/
INSERT INTO men_pd_pic VALUES
  (NULL ,'images/products/men/01/01.jpg','1'),
  (NULL ,'images/products/men/01/02.jpg','1'),
  (NULL ,'images/products/men/01/03.jpg','1'),
  (NULL ,'images/products/men/01/04.jpg','1');

/*创建men_pd_content*/
DROP TABLE IF EXISTS men_pd_content;
CREATE TABLE men_pd_content (
  pid INT PRIMARY KEY AUTO_INCREMENT,
  purl VARCHAR(32),
  productId VARCHAR(32)
);

/*给men_pd_content插入数据*/
INSERT INTO men_pd_content VALUES
  (NULL ,'images/products/men/01/06.jpg','1'),
  (NULL ,'images/products/men/01/07.jpg','1'),
  (NULL ,'images/products/men/01/08.jpg','1');


/*创建women_pd_pic*/
/*创建women_pd_content*/



/*购物车记录表*/
DROP TABLE IF EXISTS shopCar;
CREATE TABLE shopCar (
  sid INT PRIMARY KEY AUTO_INCREMENT,
  sData VARCHAR(1024),
  userName VARCHAR(32),
  number VARCHAR(32)
);





/*订单详情表*/












