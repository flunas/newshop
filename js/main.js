
var app = angular.module('shop', ['ionic', function ($httpProvider) {
    //头部配置
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.post['Accept'] = 'application/json,text/javascript,*/*;q=0.01';
    $httpProvider.defaults.headers.post['X-Requested-Width'] = 'XMLHttpRequest';

    //重写params,配合头部配置，让angular提交的数据跟jQuery提交的数据一样
    var param = function (obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; i++) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);

//配置路由
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('home');
    $stateProvider
        .state('home', {url: '/home', templateUrl: 'tpl/home.html', controller: 'homeCtrl'})
        .state('products', {
            url: '/products',
            params: {
                'sex': $.parseJSON(sessionStorage.getItem('productData')) ? ($.parseJSON(sessionStorage.getItem('productData'))).sex : null,
                'type': $.parseJSON(sessionStorage.getItem('productData')) ? ($.parseJSON(sessionStorage.getItem('productData'))).type : null,
                'initPage': $.parseJSON(sessionStorage.getItem('productData')) ? ($.parseJSON(sessionStorage.getItem('productData'))).initPage : null
            },
            templateUrl: 'tpl/products.html',
            controller: 'productCtrl'
        })  //当前页刷新时，从session中获取之前缓存的参数，避免出现null，没有数据显示(由于一开始没有缓存，造成获取不了参数，开不了网页，现采用三目运算解决)
        .state('login', {url: '/login', templateUrl: 'tpl/login.html', controller: 'loginCtrl'})
        .state('register', {
            url: '/register',
            templateUrl: 'tpl/register.html',
            controller:'regCtrl'
        })
        .state('checkout', {
            url: '/checkout',
            templateUrl: 'tpl/checkout.html',
            controller:'shopCarCtrl'
        })
        .state('single', {
            url: '/single',
            cache:'false',
            params:{
                'sex':$.parseJSON(sessionStorage.getItem('singleData'))?($.parseJSON(sessionStorage.getItem('singleData'))).sex:null,
                'pid':$.parseJSON(sessionStorage.getItem('singleData'))?($.parseJSON(sessionStorage.getItem('singleData'))).pid:null,
                'type':$.parseJSON(sessionStorage.getItem('singleData'))?($.parseJSON(sessionStorage.getItem('singleData'))).type:null
            },
            templateUrl: 'tpl/single.html',
            controller:'singleCtrl'})
        .state('blog', {url: '/blog', templateUrl: 'tpl/blog.html'})
        .state('blog_single', {url: '/blog_single', templateUrl: 'tpl/blog_single.html'})
        .state('userOrder', {url: '/userOrder', templateUrl: 'tpl/userOrder.html'});
});

app.run(['$rootScope', '$state', function ($rootScope, $state) {
    //当$location.path发生变化或者$location.url发生变化时触发
    $rootScope.$on('$locationChangeSuccess', function (event, msg) {
        //如果能获取当前state，则判断当前state是否=checkout&userOrder,如果是，则判断是否登录，若没登录，则提示跳转登录页，否则无法进入
        // console.log([event,msg]);
        //indexOf从0开始
        //截取第一个#号后第一个/后的字符串
        var stateName = msg.slice(msg.indexOf('#') + 2);
        // console.log(stateName);
        //从session中获取登录信息
        var uname = sessionStorage.getItem('LoginName');
        if (stateName === 'userOrder') {
            // console.log('userOrder');
            if (uname) {
                $state.go('userOrder');
            } else {
                $('.userOrder').html('');
                $state.go('login');
                alert('您没有登录，确定跳转登录页');
            }
        } else if (stateName === 'checkout') {
            // console.log('checkout');
            if (uname) {
                $state.go('checkout');
            } else {
                $('.car').html('');
                $state.go('login');
                alert('您没有登录，确定跳转登录页');
            }
        }
    })
}]);

//parent控制器
app.controller('parentCtrl', ['$scope', '$state','$http', function ($scope, $state,$http) {
    $scope.jump = function (path, arg) {
        if (arg) {
            $state.go(path, arg);   //(状态名,参数),当参数为{id:'',name:''}时，在.state()中url后添加params:{'id':null,'name':null},则可以再收参是可以打印到，否则undefined
            // console.log(path,arg);
        } else {
            $state.go(path);
        }

    };

    /*从会话范围内读取登录用户名*/
    var uname = sessionStorage.getItem('LoginName');
    if (uname) {
        $('.login_before').fadeOut(0);
        $('.login_after').fadeIn(0);
        $('#register').fadeOut(0);
    }

    /*注册后读取登录用户名*/
    $scope.$on('Login_ok',function (event,data) {
        var uname = sessionStorage.getItem('LoginName');
        if (uname) {
            $('.login_before').fadeOut(0);
            $('.login_after').fadeIn(0);
            $('#register').fadeOut(0);
            //向上广播，提示购物车获取数据
            $scope.$emit('Login','LoginName');
        }
    });


    /*退出登录处理事件*/
    $scope.logout = function () {
        //清除登录的用户名
        sessionStorage.clear();
        //刷新当前页面
        window.location.reload();
        $state.go('home');
    };

    //购物车
    $scope.carTips = [];
    $scope.carNumber = {};
    $scope.$watch('carTips',function () {
        // console.log($scope.carTips);
        var $carNumber = 0;
        $.each($scope.carTips,function (n,obj) {
            $carNumber += $.parseJSON(obj.number);
        });
        $scope.carNumber['total'] = $carNumber;
    });

    //监听newCar,如果下面有广播，则接受到广播刷新carNumber
    $scope.$on('newCar',function (event,data) {
        // console.log(data);

        //考虑到在我删除之后又去添加商品，所以必须要同时删除数据库中相应得数据(避免又重新获取数据库中之前保存得数据)
        $http.post('php/rm_shopCar.php',{sid:data,userName:sessionStorage.getItem('LoginName')}).success(function (data) {
            // console.log(data);
            //由于此时已经登陆，在此冒充登陆按钮发出广播，达到刷新购物车效果
            $scope.$emit('Login','LoginName');
        });
    });

    //没登陆，登陆后从数据库中读取购物车信息
    $scope.$on('Login',function (event,data) {
        $http.post('php/get_shopCar.php',{userName:sessionStorage.getItem(data)}).success(function (data) {
            if(data.obj){
                //先清空购物车，否则出现叠加
                $scope.carTips = [];
                $.each(data.obj,function (n,obj) {
                    $scope.carTips.push(obj);
                });
                //发出更新totalPrice广播
                $scope.$broadcast('newCarTips','newCarTips');
                //重新获取商品数量
                var $carNumber = 0;
                $.each($scope.carTips,function (n,obj) {
                    $carNumber += $.parseJSON(obj.number);
                });
                $scope.carNumber['total'] = $carNumber;
                //向下发出广播，更新listNumber
                $scope.$broadcast('newListNumber','newListNumber');
            }else if(data.msg){
                console.log('购物车空空如也！');
                //设置购物车为空，否则购物车没能及时更新，会有残留。
                $scope.carTips = [];
                //发出更新totalPrice广播
                $scope.$broadcast('newCarTips0','newCarTips0');
                //重新获取商品数量
                var $carNumber = 0;
                $scope.carNumber['total'] = $carNumber;
                //向下发出广播，更新listNumber
                $scope.$broadcast('newListNumber','newListNumber');
            }
        }).error(function () {
            console.log('购物车空空如也！');
        });
        //重新获取商品数量
        var $carNumber = 0;
        $.each($scope.carTips,function (n,obj) {
            $carNumber += $.parseJSON(obj.number);
        });
        $scope.carNumber['total'] = $carNumber;
    });

    //登陆后，从session中获取登陆信息并获取数据(解决刷新后没有数据问题)
    if(sessionStorage.getItem('LoginName')){
        $http.post('php/get_shopCar.php',{userName:sessionStorage.getItem('LoginName')}).success(function (data) {
            // console.log(data);
            if(data.msg){
                console.log('购物车中空空如也！');
            }else if(data.obj){
                $.each(data.obj,function (n,obj) {
                    $scope.carTips.push(obj);
                });
            }

            //重新获取商品数量
            var $carNumber = 0;
            $.each($scope.carTips,function (n,obj) {
                $carNumber += $.parseJSON(obj.number);
            });
            $scope.carNumber['total'] = $carNumber;

        }).error(function () {
            console.log('购物车空空如也！');
        })
    }else{
        console.log('没有登陆！');
    }
    $scope.$on('addCar',function (event,data) {
        // console.log("截获的数据："+data);
        // console.log($scope.carTips);
        //将修改写入数据库中
        $http.post('php/set_shopCar.php',{userName:sessionStorage.getItem('LoginName'),sData:angular.toJson(sessionStorage.getItem(data))}).success(function (data) {
            if(data.msg=='upData'||data.msg=='newList'){
                // console.log(data.msg);
                //如果保存成功，清空购物车，重新从数据库读取购物车信息
                $http.post('php/get_shopCar.php',{userName:sessionStorage.getItem('LoginName')}).success(function (data) {
                    // console.log(data);
                    if(data.msg){
                        console.log('购物车中空空如也！');
                    }else if(data.obj){
                        //先清空购物车，否则出现叠加
                        $scope.carTips = [];
                        $.each(data.obj,function (n,obj) {
                            $scope.carTips.push(obj);
                        });
                    }

                    //重新获取商品数量
                    var $carNumber = 0;
                    $.each($scope.carTips,function (n,obj) {
                        $carNumber += $.parseJSON(obj.number);
                    });
                    $scope.carNumber['total'] = $carNumber;

                }).error(function () {
                    console.log('购物车空空如也！');
                })
            }else{
                console.log('保存失败！');
            }
        }).error(function () {
            console.log('操作失败！');
        });
    });

}]);

//Home控制器
app.controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.post('php/home_get_newlist.php').success(function (data) {
        // console.log(data);//返回一个数据，里面有6个对象
        $scope.new_data = data;
    });

    $http.post('php/home_get_featlist.php').success(function (data) {
        // console.log(data);//返回一个数据，里面有6个对象
        $scope.t1 = data[0];
        $scope.t2 = data[1];
        $scope.t3 = data[2];
        $scope.t4 = data[3];
    });
}]);

//register控制器
app.controller('regCtrl',['$scope','$http','$state',function ($scope,$http,$state) {
    //如果检测到已登录，则跳转到个人中心页
    var uname = sessionStorage.getItem('LoginName');
    if(uname){
        $state.go('userOrder');
    }

    $scope.uname = '';
    $scope.upwd = '';
    $scope.upwd2 = '';
    $scope.email = '';

    $scope.focus = function () {
        $scope.uname_ok = false;
        $scope.uname_err = false;
    };
    $scope.blur = function () {
        if($scope.uname!=undefined){
            console.log('blur');
            $http.post('php/check_uname.php',{uname:$scope.uname}).success(function (data) {
                if(data.msg=='ok'){
                    console.log('用户名已被注册');
                    $scope.uname_err = true;
                }else if(data.msg=='no'){
                    console.log('用户名可以使用');
                    $scope.uname_ok = true;
                }
            });
        }
    };
    $scope.submit = function () {
        var user = {};
        user['uname'] = $scope.uname;
        user['upwd'] = $scope.upwd;
        user['email'] = $scope.email;
        $http.post('php/register.php',{user:user}).success(function (data) {
            if(data.msg=='succ'){
                console.log(data.obj);
                sessionStorage.setItem('LoginName', data.obj.uname);
                //向上广播，提示新注册
                $scope.$emit('Login_ok','LoginName');
                alert('注册成功，确定跳转个人中心页……');
                $state.go('userOrder');
            }else if(data.msg=='err'){
                alert('注册失败！请重新注册……');
            }
        });
    }
}]);

//login控制器
app.controller('loginCtrl', ['$state', '$scope', '$http', function ($state, $scope, $http) {
    $scope.uname = '';
    $scope.upwd = '';
    /*设置监听，为以后进行输入字符判断作准备*/
    $scope.$watch('uname', function () {
        // console.log($scope.uname);
        // console.log($scope);
    });
    $scope.$watch('upwd', function () {
        // console.log($scope.upwd);
    });
    $scope.login_submit = function () {
        // console.log($scope.uname,$scope.upwd);
        $http.post('php/login.php', {uname: $scope.uname, upwd: $scope.upwd}).success(function (data) {
            // console.log(data);
            if (data.msg === 'succ') {
                $('.login_before').fadeOut(0);
                $('.login_after').fadeIn(0);
                $('#register').fadeOut(0);
                sessionStorage.setItem('LoginName', data.obj.uname);
                //向上广播，提示购物车获取数据
                $scope.$emit('Login','LoginName');
                alert('登录成功，点击跳转首页');
                $state.go('home');
            } else if (data.msg === 'err') {
                alert('用户名或密码错误，请重新输入！');
            } else {
                alert('数据出错，请重启浏览器！');
            }
        });
    };

}]);

//productCtrl
app.controller('productCtrl', ['$scope', '$stateParams', '$http', function ($scope, $stateParams, $http) {
    // console.log("id:"+$stateParams.sex,"type:"+$stateParams.type);  //收参并打印参数
    // console.log($stateParams);   //输出一个对象，对象中包含传递过来的参数
    //将收到的参数缓存到session中，避免当前页刷新出现null,获取不到数据
    if ($stateParams.sex === null || $stateParams.type === null || $stateParams.initPage === null) {        //避免直接复制地址，没有传入参数，没有缓存参数，因此在这直接默认指定一个参数（在此判断了，后面的post请求就不必用三目运算了）
        $stateParams.sex = 'men';
        $stateParams.type = 'ssyr';
        $stateParams.initPage = '1';
    }
    var productData = angular.toJson($stateParams);  //序列化参数，用来保存到session中
    // console.log(productData);
    sessionStorage.setItem('productData', productData);
    //将从session中获取的参数解析为Obj
    // var getProductDataObj = $.parseJSON(sessionStorage.getItem('productData'));
    // console.log(getProductDataObj);
    //从数据库中获取产品数据
    $http.post('php/product_get_pddata.php', {
        sex: $stateParams.sex,
        type: $stateParams.type,
        initPage: $stateParams.initPage
    })
        .success(function (data) {
            // console.log(data);
            //更新页面内容
            $scope.pddate = data.list;
            //定义分页器
            // console.log(data.total);
            for (var i = 1, html = []; i <= data.total; i++) {
                html += `<li><button value="${i}" class="text-center">${i}</button></li>`;
            }
            $('.pagi2').html(html);
            //定义默认当前页背景
            var acinitPage = ($.parseJSON(sessionStorage.getItem('productData'))).initPage;
            var firstNum = '1';
            var lastNum = data.total;
            // console.log(acinitPage,lastNum);
            if(acinitPage==firstNum&&acinitPage==lastNum){
                $('.pagi_left,.pagi_right').animate({width:'0',padding:'0'},500);
                $('.pagi2>li:first-child>button,.pagi2>li:last-child>button').animate({borderTopLeftRadius:'5px',borderBottomLeftRadius:'5px',borderTopRightRadius:'5px',borderBottomRightRadius:'5px'},500);
                $('.pagi2>li>button[value='+acinitPage+']').css({background:'#ef5f21',borderColor:'#ef5f21'});
            }else if(acinitPage==firstNum){
                $('.pagi_left').animate({width:'0',padding:'0'},500);
                $('.pagi_right').animate({width:'40px',padding:'1px 6px'},500);
                $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'5px',borderBottomLeftRadius:'5px'},500);
                $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'0',borderBottomRightRadius:'0',background:'#ddd',borderColor:'#ddd'},500);
                $('.pagi2>li>button[value='+acinitPage+']').css({background:'#ef5f21',borderColor:'#ef5f21'});
            }else if(acinitPage==lastNum){
                $('.pagi_right').animate({width:'0',padding:'0'},500);
                $('.pagi_left').animate({width:'40px',padding:'1px 6px'},500);
                $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'5px',borderBottomRightRadius:'5px'},500);
                $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'0',borderBottomLeftRadius:'0',background:'#ddd',borderColor:'#ddd'},500);
                $('.pagi2>li>button[value='+acinitPage+']').css({background:'#ef5f21',borderColor:'#ef5f21'});
            }else {
                $('.pagi_left,.pagi_right').animate({width:'40px',padding:'1px 6px'},500);
                $('.pagi2>li:first-child>button,.pagi2>li:last-child>button').animate({borderTopLeftRadius:'0',borderBottomLeftRadius:'0',borderTopRightRadius:'0',borderBottomRightRadius:'0'},500);
                $('.pagi2>li>button[value='+acinitPage+']').css({background:'#ef5f21',borderColor:'#ef5f21'});
            }

            //点击页数按钮，跳转到特定页
            $('.pagi2').on('click', 'li', function () {
                var acinitPage = $(this).children('button').val();

                //控制左右按钮显示隐藏
                // var firstNum = '1';
                // var lastNum = data.total;
                if(acinitPage==firstNum&&acinitPage==lastNum){
                    $('.pagi_left,.pagi_right').animate({width:'0',padding:'0'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'5px',borderBottomLeftRadius:'5px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'5px',borderBottomRightRadius:'5px'},500);
                }else if(acinitPage==firstNum){
                    $('.pagi_left').animate({width:'0',padding:'0'},500);
                    $('.pagi_right').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'5px',borderBottomLeftRadius:'5px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'0',borderBottomRightRadius:'0'},500);
                }else if(acinitPage==lastNum){
                    $('.pagi_right').animate({width:'0',padding:'0'},500);
                    $('.pagi_left').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'5px',borderBottomRightRadius:'5px'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'0',borderBottomLeftRadius:'0'},500);
                }else {
                    $('.pagi_left,.pagi_right').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:first-child>button,.pagi2>li:last-child>button').animate({borderTopLeftRadius:'0',borderBottomLeftRadius:'0',borderTopRightRadius:'0',borderBottomRightRadius:'0'},500);
                }

                $http.post('php/product_get_pddata.php', {
                    sex: ($.parseJSON(sessionStorage.getItem('productData'))).sex,
                    type: ($.parseJSON(sessionStorage.getItem('productData'))).type,
                    initPage: acinitPage
                })
                    .success(function (data) {
                        // console.log(data);
                        //更新session
                        var productData2 = {};
                        productData2['sex'] = ($.parseJSON(sessionStorage.getItem('productData'))).sex;
                        productData2['type'] = ($.parseJSON(sessionStorage.getItem('productData'))).type;
                        productData2['initPage'] = acinitPage;
                        sessionStorage.setItem('productData', angular.toJson(productData2));

                        //更新页面内容
                        $scope.pddate = data.list;
                    })
                    .error(function () {
                        alert('请求数据出错，跳转至第一页……');
                        $http.post('php/product_get_pddata.php', {
                            sex: 'men',
                            type: 'ssyr',
                            initPage: '1'
                        })
                            .success(function (data) {
                                //更新页面内容
                                $scope.pddate = data.list;

                                //更新分页器
                                for (var i = 1, html = []; i <= data.total; i++) {
                                    html += `<li><button value="${i}" class="text-center">${i}</button></li>`;
                                }
                                $('.pagi2').html(html);

                                //重置session
                                var productData3 = {};
                                productData3['sex'] = 'men';
                                productData3['type'] = 'ssyr';
                                productData3['initPage'] = '1';
                                sessionStorage.setItem('productData', angular.toJson(productData3));
                            })
                            .error(function () {
                                alert('网站出现问题，请联系管理员：1105905768@qq.com');
                                $state.go('home');
                            })
                    });
                //更新页数按钮背景
                $(this).siblings().children('button').css({background:'#ddd',borderColor:'#ddd'});
                $(this).children().css({background:'#ef5f21',borderColor:'#ef5f21'});
            });

            //控制左按钮
            $scope.PagiSelect_lf = function () {
                //获取当前显示的页数并转换成number
                var acNum = parseInt(($.parseJSON(sessionStorage.getItem('productData'))).initPage);
                var acinitPage = acNum-1;

                //控制左右按钮显示隐藏
                // var firstNum = '1';
                // var lastNum = data.total;
                if(acinitPage==firstNum&&acinitPage==lastNum){
                    $('.pagi_left,.pagi_right').animate({width:'0',padding:'0'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'5px',borderBottomLeftRadius:'5px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'5px',borderBottomRightRadius:'5px'},500);
                }else if(acinitPage==firstNum){
                    $('.pagi_left').animate({width:'0',padding:'0'},500);
                    $('.pagi_right').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'5px',borderBottomLeftRadius:'5px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'0',borderBottomRightRadius:'0'},500);
                }else if(acinitPage==lastNum){
                    $('.pagi_right').animate({width:'0',padding:'0'},500);
                    $('.pagi_left').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'5px',borderBottomRightRadius:'5px'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'0',borderBottomLeftRadius:'0'},500);
                }else {
                    $('.pagi_left,.pagi_right').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:first-child>button,.pagi2>li:last-child>button').animate({borderTopLeftRadius:'0',borderBottomLeftRadius:'0',borderTopRightRadius:'0',borderBottomRightRadius:'0'},500);
                }

                $http.post('php/product_get_pddata.php', {
                    sex: ($.parseJSON(sessionStorage.getItem('productData'))).sex,
                    type: ($.parseJSON(sessionStorage.getItem('productData'))).type,
                    initPage: acinitPage
                })
                    .success(function (data) {
                        // console.log(data);
                        //更新session
                        var productData2 = {};
                        productData2['sex'] = ($.parseJSON(sessionStorage.getItem('productData'))).sex;
                        productData2['type'] = ($.parseJSON(sessionStorage.getItem('productData'))).type;
                        productData2['initPage'] = acinitPage;
                        sessionStorage.setItem('productData', angular.toJson(productData2));

                        //更新页面内容
                        $scope.pddate = data.list;
                    })
                    .error(function () {
                        alert('请求数据出错，跳转至第一页……');
                        $http.post('php/product_get_pddata.php', {
                            sex: 'men',
                            type: 'ssyr',
                            initPage: '1'
                        })
                            .success(function (data) {
                                //更新页面内容
                                $scope.pddate = data.list;

                                //更新分页器
                                for (var i = 1, html = []; i <= data.total; i++) {
                                    html += `<li><button value="${i}" class="text-center">${i}</button></li>`;
                                }
                                $('.pagi2').html(html);

                                //重置session
                                var productData3 = {};
                                productData3['sex'] = 'men';
                                productData3['type'] = 'ssyr';
                                productData3['initPage'] = '1';
                                sessionStorage.setItem('productData', angular.toJson(productData3));
                            })
                            .error(function () {
                                alert('网站出现问题，请联系管理员：1105905768@qq.com');
                                $state.go('home');
                            })
                    });
                //更新页数按钮背景
                $('.pagi2>li').siblings().children('button').css({background:'#ddd',borderColor:'#ddd'});
                $('.pagi2').find('button[value='+acinitPage+']').css({background:'#ef5f21',borderColor:'#ef5f21'});
                // console.log('当前页：'+acNum);
            };
            //控制右按钮
            $scope.PagiSelect_rt = function () {
                //获取当前显示的页数并转换成number
                var acNum = parseInt(($.parseJSON(sessionStorage.getItem('productData'))).initPage);
                var acinitPage = acNum+1;

                //控制左右按钮显示隐藏
                // var firstNum = '1';
                // var lastNum = data.total;
                if(acinitPage==firstNum&&acinitPage==lastNum){
                    $('.pagi_left,.pagi_right').animate({width:'0',padding:'0'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'5px',borderBottomLeftRadius:'5px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'5px',borderBottomRightRadius:'5px'},500);
                }else if(acinitPage==firstNum){
                    $('.pagi_left').animate({width:'0',padding:'0'},500);
                    $('.pagi_right').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'5px',borderBottomLeftRadius:'5px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'0',borderBottomRightRadius:'0'},500);
                }else if(acinitPage==lastNum){
                    $('.pagi_right').animate({width:'0',padding:'0'},500);
                    $('.pagi_left').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:last-child>button').animate({borderTopRightRadius:'5px',borderBottomRightRadius:'5px'},500);
                    $('.pagi2>li:first-child>button').animate({borderTopLeftRadius:'0',borderBottomLeftRadius:'0'},500);
                }else {
                    $('.pagi_left,.pagi_right').animate({width:'40px',padding:'1px 6px'},500);
                    $('.pagi2>li:first-child>button,.pagi2>li:last-child>button').animate({borderTopLeftRadius:'0',borderBottomLeftRadius:'0',borderTopRightRadius:'0',borderBottomRightRadius:'0'},500);
                }

                $http.post('php/product_get_pddata.php', {
                    sex: ($.parseJSON(sessionStorage.getItem('productData'))).sex,
                    type: ($.parseJSON(sessionStorage.getItem('productData'))).type,
                    initPage: acinitPage
                })
                    .success(function (data) {
                        // console.log(data);
                        //更新session
                        var productData2 = {};
                        productData2['sex'] = ($.parseJSON(sessionStorage.getItem('productData'))).sex;
                        productData2['type'] = ($.parseJSON(sessionStorage.getItem('productData'))).type;
                        productData2['initPage'] = acinitPage;
                        sessionStorage.setItem('productData', angular.toJson(productData2));

                        //更新页面内容
                        $scope.pddate = data.list;
                    })
                    .error(function () {
                        alert('请求数据出错，跳转至第一页……');
                        $http.post('php/product_get_pddata.php', {
                            sex: 'men',
                            type: 'ssyr',
                            initPage: '1'
                        })
                            .success(function (data) {
                                //更新页面内容
                                $scope.pddate = data.list;

                                //更新分页器
                                for (var i = 1, html = []; i <= data.total; i++) {
                                    html += `<li><button value="${i}" class="text-center">${i}</button></li>`;
                                }
                                $('.pagi2').html(html);

                                //重置session
                                var productData3 = {};
                                productData3['sex'] = 'men';
                                productData3['type'] = 'ssyr';
                                productData3['initPage'] = '1';
                                sessionStorage.setItem('productData', angular.toJson(productData3));
                            })
                            .error(function () {
                                alert('网站出现问题，请联系管理员：1105905768@qq.com');
                                $state.go('home');
                            })
                    });
                //更新页数按钮背景
                $('.pagi2>li').siblings().children('button').css({background:'#ddd',borderColor:'#ddd'});
                $('.pagi2').find('button[value='+acinitPage+']').css({background:'#ef5f21',borderColor:'#ef5f21'});
                // console.log('当前页：'+acNum);
            };
        })
        .error(function () {
            alert('请求数据出错，跳转至第一页……');
            $http.post('php/product_get_pddata.php', {sex: 'men', type: 'ssyr', initPage: '1'})
                .success(function (data) {
                    //更新页面内容
                    $scope.pddate = data.list;

                    //更新分页器
                    for (var i = 1, html = []; i <= data.total; i++) {
                        html += `<li><button value="${i}" class="text-center">${i}</button></li>`;
                    }
                    $('.pagi2').html(html);

                    //重置session
                    var productData3 = {};
                    productData3['sex'] = 'men';
                    productData3['type'] = 'ssyr';
                    productData3['initPage'] = '1';
                    sessionStorage.setItem('productData', angular.toJson(productData3));
                })
                .error(function () {
                    alert('网站出现问题，请联系管理员：1105905768@qq.com');
                    $state.go('home');
                })
        });
}]);

//single
app.controller('singleCtrl',['$scope','$stateParams','$http','$state',function ($scope,$stateParams,$http,$state) {
    // console.log($stateParams);
    //如果刷新出现null,则判断跳转回列表页重新选择商品查看
    if($stateParams.pid===null || $stateParams.sex===null || $stateParams.type===null){
        var obj = $.parseJSON(sessionStorage.getItem('productData'));
        // console.log(obj.sex,obj.type,obj.initPage);
        alert('请选择商品……');
        $state.go('products',{sex:'obj.sex',type:'obj.type',initPage:'obj.initPage'});
    }

    //序列化参数保存到session中
    var singleData = angular.toJson($stateParams);
    sessionStorage.setItem('singleData',singleData);

    //从数据库中product获取商品信息
    $http.post('php/single_get_pddata.php',{sex:$stateParams.sex,pid:$stateParams.pid}).success(function (data) {
        $scope.pdetail = data[0];
        $scope.pdcolor = ((data[0]).color).split('/');
        $scope.pdsize = ((data[0]).size).split('/');

        $scope.color = $scope.pdcolor[0];
        $scope.size = $scope.pdsize[0];
        $scope.$watch('color',function () {
            // console.log($scope.color);   //已成功监听
        });
        $scope.$watch('size',function () {
            // console.log($scope.size);    //已成功监听
        });
    }).error(function () {
        alert('没有此商品信息！请重新选择');
    });
    //从数据库中pd_pic表获取轮播图图片
    $http.post('php/single_get_pd_pic.php',{sex:$stateParams.sex,pid:$stateParams.pid}).success(function (data) {
        $scope.pdpic = data;
    }).error(function () {
        alert('数据库中没有此商品的图片，请联系管理员处理！');
    });
    //从数据库中pd_content表获取详细介绍图片
    $http.post('php/single_get_pd_content.php',{sex:$stateParams.sex,pid:$stateParams.pid}).success(function (data) {
        $scope.description = data;
    }).error(function () {
        alert('数据库中没有此条商品的详细信息，请联系管理员处理');
    });
    //从数据库中product获取3条相关商品信息
    $http.post('php/single_get_related_pddata.php',{sex:$stateParams.sex,pid:$stateParams.pid,type:$stateParams.type}).success(function (data) {
        $scope.relatedpddata = data;
    }).error(function () {
        alert('操作失败，请联系管理员处理');
    });
    //刷新当前页面
    // window.location.reload();

    //添加到购物车
    $scope.addCar = function () {
        //判断是否登陆
        if(sessionStorage.getItem('LoginName')){
            // console.log('已登陆');
            var addToCarData = {};
            addToCarData['sex'] = $stateParams.sex;
            addToCarData['type'] = $stateParams.type;
            addToCarData['pid'] = $stateParams.pid;
            addToCarData['acColor'] = $scope.color;
            addToCarData['acSize'] = $scope.size;
            sessionStorage.setItem('addToCarData',angular.toJson(addToCarData));
            //向上广播
            $scope.$emit('addCar','addToCarData');
        }else{
            console.log('没有登陆！');
            alert('请先登陆，确定弹出登陆框……');
        }
    };
}]);

//shopCarCtrl
app.controller('shopCarCtrl',['$scope','$http','$state',function ($scope,$http,$state) {
    // console.log('shopCarCtrl');
    var $sData,$pdData={},$totalPrice={};
    $totalPrice['total'] = 0;

    //继续去购物
    $scope.goBuy =function () {
        // console.log('继续去购物！');
        //从session中读取productData数据
        $state.go('products',{sex:($.parseJSON(sessionStorage.getItem('productData'))).sex,type:($.parseJSON(sessionStorage.getItem('productData'))).type,initPage:($.parseJSON(sessionStorage.getItem('productData'))).initPage});
    };



    //点击提交订单
    $scope.placeOrder = function () {
        console.log('提交订单！');
        $.each($scope.pdData,function (n,obj) {
            delete obj.color;
            delete obj.size;
        });
        $http.post('php/set_user_po.php',{userName:sessionStorage.getItem('LoginName'),poData:angular.toJson($scope.pdData),totalPrice:$totalPrice.total}).success(function (data) {
            //发出广播，更新购物车数据和相关的数据
            $scope.$emit('Login','LoginName');
            $pdData = [];
            $scope.pdData = $pdData;

            alert('弹出一个模态框，继续购物 或者 订单详情页');
        });
    };


    $scope.listNumber = $scope.carTips.length;
    //接受广播，更新数量
    $scope.$on('newListNumber',function (event,data) {
        // console.log($scope.carTips);
        $scope.listNumber = $scope.carTips.length;

    });


    $.each($scope.carTips,function (n,obj) {
        // console.log($.parseJSON(obj.number));
        $sData = $.parseJSON((obj.sData).slice(1,-1));   //去掉头尾引号，即可转换为对象
        $sData.number = $.parseJSON(obj.number);
        $sData.userName = obj.userName;
        $sData.sid = obj.sid;
        $pdData[obj.sid] = $sData;
        $http.post('php/single_get_pddata.php',{sex:$sData.sex,pid:$sData.pid}).success(function (data) {
            for(var key in data[0]){
                if(!$pdData[obj.sid][key]){
                    $pdData[obj.sid][key] = data[0][key];
                }
            }
            $pdData[obj.sid].color = ($pdData[obj.sid].color).split('/');
            $pdData[obj.sid].size = ($pdData[obj.sid].size).split('/');

            $totalPrice['total'] += $.parseJSON(data[0].price)*$.parseJSON(obj.number);
            $scope.totalPrice = $totalPrice;
        });

    });
    // console.log($pdData);
    $scope.pdData = $pdData;

    //当删除某条记录时，重新读取totalPrice
    $scope.$on('newCarTips',function (event,data) {

        $totalPrice['total'] = 0;   //先清零(循环之前)
        $.each($scope.carTips,function (n,obj) {
            // console.log($.parseJSON(obj.number));
            $sData = $.parseJSON((obj.sData).slice(1,-1));   //去掉头尾引号，即可转换为对象
            $sData.number = $.parseJSON(obj.number);
            $sData.userName = obj.userName;
            $sData.sid = obj.sid;
            $pdData[obj.sid] = $sData;
            $http.post('php/single_get_pddata.php',{sex:$sData.sex,pid:$sData.pid}).success(function (data) {
                for(var key in data[0]){
                    if(!$pdData[obj.sid][key]){
                        $pdData[obj.sid][key] = data[0][key];
                    }
                }
                $pdData[obj.sid].color = ($pdData[obj.sid].color).split('/');
                $pdData[obj.sid].size = ($pdData[obj.sid].size).split('/');

                $totalPrice['total'] += $.parseJSON(data[0].price)*$.parseJSON(obj.number);
                $scope.totalPrice = $totalPrice;
            });

        });
        // console.log($pdData);
        $scope.pdData = $pdData;
    });
    //当记录为零时，更新记录
    $scope.$on('newCarTips0',function (evnet,data) {
        $totalPrice['total'] = 0;
        $scope.totalPrice = $totalPrice;
    });

    //如果使用加减按钮修改数量，每一次加减1，则每一次加减对应的单价一次(直接修改数量也提交到这里修改价格)
    $scope.$on('add',function (event,data) {
        if(data.price!=undefined){
            if(data.newData<='0'||data.newData==''||data.newData=='-'){
                data.newData = 0;
                if(data.oldData==''||data.oldData=='-'||data.oldData<='0'){
                    console.log(data);
                    data.oldData = 0;
                    $totalPrice['total'] += ($.parseJSON(data.newData)-$.parseJSON(data.oldData))*$.parseJSON(data.price);
                    $scope.totalPrice = $totalPrice;
                    console.log($scope.totalPrice);
                }else{
                    console.log(data);
                    $totalPrice['total'] += ($.parseJSON(data.newData)-$.parseJSON(data.oldData))*$.parseJSON(data.price);
                    $scope.totalPrice = $totalPrice;
                    console.log($scope.totalPrice);
                }

            }else{
                if(data.oldData==''||data.oldData=='-'||data.oldData<='0'){
                    console.log(data);
                    data.oldData = 0;
                    $totalPrice['total'] += ($.parseJSON(data.newData)-$.parseJSON(data.oldData))*$.parseJSON(data.price);
                    $scope.totalPrice = $totalPrice;
                    console.log($scope.totalPrice);
                }else{
                    console.log(data);
                    $totalPrice['total'] += ($.parseJSON(data.newData)-$.parseJSON(data.oldData))*$.parseJSON(data.price);
                    $scope.totalPrice = $totalPrice;
                    console.log($scope.totalPrice);
                }
            }
        }
    });

}]).directive('slNumber',function () {
    return{
        restrict:'AE',
        replace:true,
        template:
        '<div class="number">' +
            'Number : '+
            '<button ng-click="add(1)">-</button> '+
            '<input ng-model="number" class="text-center" type="text" value="{{number}}"> '+
            '<button ng-click="add(2)">+</button>'+
        '</div>'
        ,
        scope:{
            number:'='
        },
        compile:function (element,attrs) {
            return function (scope,element,attrs) {
                scope.add = function (arg) {
                    if(arg===1){
                        if(scope.number>0){
                            scope.number--;
                            //向上广播，更新数量(由于之后有监听，这里就不需要了)
                            // scope.$emit('add',-scope.$parent.obj.price);
                        }
                    }else if(arg===2){
                        scope.number++;
                        // scope.$emit('add',+scope.$parent.obj.price);
                    }
                };
                scope.$watch('number',function (newData,oldData) {
                    //向上广播，更新数量
                    scope.$emit('add',{newData:newData,oldData:oldData,price:scope.$parent.obj.price});
                });
            }
        }

    }
}).directive('remove',function () {
    return{
        restrict:'AE',
        replace:true,
        template:'<i ng-click="remo(sid)" class="fa-times text-center"></i>',
        scope:{sid:'='},
        compile:function (element,attrs) {
            return function (scope,element,attrs) {
                scope.remo = function (arg) {
                    // console.log(arg);
                    delete scope.$parent.$parent.pdData[arg];  //删除$scope.pdData中得arg属性
                    //由于发出广播，冒充登录按钮来更新购物车，这里就不用再操作其他了
                    // delete scope.$parent.$parent.$parent.carTips[arg-1];
                    //向上广播
                    scope.$emit('newCar',arg);
                };
            }
        }

    }
});


/*       Login and register and car       */
$('#header').on('mouseenter', '#login,#register,#car', function () {
    if ($(this).attr('id') === 'car') {
        $(this).children('i').css('color', '#000');
        $(this).children('div').css('color', '#fff');
    }
    $(this).css({background: '#fff', color: '#000'});
});
$('#header').on('mouseleave', '#login,#register,#car', function () {
    if ($(this).attr('id') === 'car') {
        $(this).children('i').css('color', '#fff');
    }
    $(this).css({background: '#000', color: '#fff'});
});

/*登录后头像弹出框*/
$('.login_after').hover(
    function () {
        $(this).css({background: '#000'});
        $('.login_after_box').slideDown(500);
    },
    function () {
        $('.login_after_box').slideUp(500);
    }
);

/*      menu        */
$('#header').on('mouseenter', '#home,#men,#women,#blog', function () {
    $(this).css({background: '#000', color: '#fff', cursor: 'pointer'});
});
$('#header').on('mouseleave', '#home,#men,#women,#blog', function () {
    $(this).css({background: '#fff', color: '#000'});
});

/*        new_li          */
$(document).ready(function () {
    $('#section').on('mouseenter', '.nr_h', function () {
        console.log($(this));
    });
});

/*       men and women menu       */
$('#header').on('mouseenter', '#men', function () {
    $('.men_menu').slideDown(500).css({opacity: '1', zIndex: '11'});
});
$('#header').on('mouseleave', '#men', function () {
    $('.men_menu').slideUp(500).css({opacity: '0', zIndex: '10'});
});
$('#header').on('mouseenter', '#women', function () {
    $('.women_menu').slideDown(500).css({opacity: '1', zIndex: '11'});
});
$('#header').on('mouseleave', '#women', function () {
    $('.women_menu').slideUp(500).css({opacity: '0', zIndex: '10'});
});




