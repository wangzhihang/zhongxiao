appControllers.controller('market-ord', function($scope, $stateParams, $http, $rootScope, my, $ionicLoading, $ionicPopup, $state, $sce, $compile) {
    $scope.title = '确认订单';
    $scope.loading = true;
    $scope.noDefaultAdd = false;
    $scope.totalPrice = 0;
    $scope.ww = true;
    $scope.defaultAdd = '';
    $scope.qishu = 12;
    $scope.judgeExit = null;

    $scope.productCode = $stateParams.productCode;
    $scope.carList = JSON.parse(localStorage.getItem('carList'));
    $scope.subject1 = '';
    for (var i in $scope.carList) {
        $scope.totalPrice += ($scope.carList[i].orderNum * $scope.carList[i].soldPrice);
        $scope.subject1 += $scope.carList[i].keyword + '——';
    }
    $scope.productName = "";
    $scope.imgUrl = "";
    $scope.payAble = "";
    $scope.businessId = "";
    $scope.orderCode = "";

    $scope.businessId = 1;
    $scope.businessName = "号码之家";
    $scope.receiveId = '';
    $scope.productList = [];

    $scope.newReceiveId = '';
    $scope.oldReceiveId = '';
    $scope.active = '';
    $scope.boa = {};
    $scope.bob = {};


    $scope.amountPayable = '';



    $scope.productList = [];
    $scope.activeBos = localStorage.getItem('activeBos');
    $scope.activeName = localStorage.getItem('activeName');
    $scope.activeId = localStorage.getItem('activeId');
    $scope.discount = localStorage.getItem('discount');
    $scope.reachLevel = localStorage.getItem('reachLevel');
    $scope.amountPayment = '';

    //构建后端需要的数组
    $scope.proLis = [];
    for (var k in $scope.carList) {
        $scope.proLis.push({ productCode: "", price: "", nums: "" });
        $scope.proLis[k].productCode = $scope.carList[k].productCode;
        $scope.proLis[k].price = $scope.carList[k].soldPrice;
        $scope.proLis[k].nums = $scope.carList[k].orderNum;
    }


    // //选择微信支付
    // $scope.wxClick = function(){
    // 	$scope.ww = true;
    // }
    // //选择沃支付
    // $scope.wopayClick = function(){
    // 	$scope.ww = false;
    // }
    // //花呗支付
    // $scope.huabeiClick = function(){

    // }
    //选择花呗分期期数
    $scope.choseHuabeiStag = function() {
        //获取花呗分期详情
        $http({
            "method": 'post',
            "url": ajaxurl + 'HuaBei/calculation',
            "data": { 'price': $scope.amountPayment }
        }).success(function(data) {
            if (data) {
                $scope.boa = data.boa;
                $scope.bob = data.bob;
                $scope.tag1 = {
                    current1: true
                };
                $scope.amountPayment = $scope.boa.total;
            }
        }).error(function(data) {
            my.alert('服务器请求失败').then(function() {

            });
        });
    }

    //切换花呗分期
    $scope.switchPer = function(params) {
            if (params == 1) {
                $scope.tag1.current1 = true;
                $scope.tag1.current2 = false;
                $scope.qishu = 12;
                $scope.amountPayment = $scope.boa.total;
            } else if (params == 2) {
                $scope.tag1.current1 = false;
                $scope.tag1.current2 = true;
                $scope.qishu = 24;
                $scope.amountPayment = $scope.bob.total;
            }
        }
        //判断是否注册花呗商家
    $scope.judgeExitHuabei = function() {
        $http({
            method: 'POST',
            url: ajaxurl + 'huabei/selectAgentCodeAndSign?token=' + $rootScope.token
        }).success(function(data) {
            if (data.wxHuaBeiBo == null) {
                my.confirm('未注册花呗花呗商家，请先去"我的——支付宝授权"进行支付宝授权，然后在"我的——花呗商家注册"进行注册', '', '去授权', '暂时不了').then(function() {
                    $state.go('userCenter');
                }, function() {})
            } else {
                if (data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == 1) {
                    $scope.judgeExit = 1;
                    if ($scope.judgeExit == 1) {
                        $scope.HuabeiStag = true;
                        $scope.choseHuabeiStag();
                    } else {
                        my.confirm('未注册花呗花呗商家，请先去"我的——支付宝授权"进行支付宝授权，然后在"我的——花呗商家注册"进行注册', '', '去授权', '暂时不了').then(function() {
                            $state.go('userCenter');
                        }, function() {})
                    }
                } else if (data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == 2) {
                    my.confirm('支付宝商家审核未通过,请重新注册', '', '去注册', '暂时不了').then(function() {
                        $state.go('user-huabei-register');
                    }, function() {})
                } else if (data.wxHuaBeiBo.userCode != null && data.wxHuaBeiBo.status == null) {
                    my.alert('支付宝正在审核,花呗分期暂时不可用。')
                } else if (data.wxHuaBeiBo.userCode == null && data.wxHuaBeiBo.status == null) {
                    my.confirm('未注册花呗花呗商家，请先去"我的——支付宝授权"进行支付宝授权，然后在"我的——花呗商家注册"进行注册', '', '去授权', '暂时不了').then(function() {
                        $state.go('userCenter');
                    }, function() {})
                }
            }

        }).error(function(err) {
            my.alert('数据信息获取失败！请稍后尝试。');
        });
    }

    //选择支付方式
    $scope.tag = {
        current: 1
    }
    $scope.chosePayType = function(params) {
        $scope.tag.current = params;
        if (params == 3) {
            $scope.judgeExitHuabei();

        } else {
            $scope.HuabeiStag = false;
        }
    }



    if ($scope.totalPrice > $scope.reachLevel || $scope.totalPrice == $scope.reachLevel) {
        $scope.amountPayment = $scope.totalPrice - $scope.discount;
        $scope.discount = $scope.discount;
    } else {
        $scope.amountPayment = $scope.totalPrice;
        $scope.discount = 0;
    }



    //购物车结算按钮进入订单
    $scope.getData = function(payAble, businessId) {
        // $scope.carList=[];
        $http({
            method: 'GET',
            url: ajaxurl + 'ehOrder/orderConfirm?token=' + $rootScope.token,
            params: {
                payAble: $scope.amountPayment,
                businessId: $scope.businessId
            }

        }).success(function(data) {
            $scope.loading = false;
            // if(data.defaultAdd == ""){
            //        			   $scope.noDefaultAdd = false;
            //        		}else{
            //        		    $scope.noDefaultAdd = true;
            $scope.defaultAdd = data.defaultAdd;
            // }
            $scope.active = data.active;
        }).error(function() {
            my.alert("遇到问题，请重试");
        });
    };

    $scope.getData();

    //微信支付
    $scope.wexinPay = function() {
            navigator.weixin.sendPayReq({
                "appid": "wxab73944d08b342cf",
                "urlString": "http://z.haoma.cn/tms-app-war/ehOrder/pay",
                "method": "post",
                "data": {
                    "orderCode": $scope.orderCode,
                    "amountPayable": $scope.amountPayment,
                    "token": $rootScope.token,
                    "mchId": "1461428102",
                    "appId": "wxab73944d08b342cf"
                }
            }, function(retcode) {
                if (retcode == '0') {
                    callbackInfo = "支付成功";

                } else if (retcode == '-2') {
                    callbackInfo = "中途取消";
                } else {
                    callbackInfo = "支付失败";
                }
                $ionicLoading.show({
                    template: callbackInfo
                });
                $timeout(function() {
                    $ionicLoading.hide();
                }, 2000);
            }, function(message) {
                if (message == '-2') {
                    callbackInfo = "中途取消";
                } else {
                    callbackInfo = "支付失败";
                }
                $ionicLoading.show({
                    template: callbackInfo
                });
            }).error(function() {

            });
        }
        //沃支付
    $scope.woPay = function() {
            $http({
                method: 'post',
                url: ajaxurl + 'epay/getSignString?token=' + $rootScope.token,
                data: {
                    'orderBalance': $scope.totalPrice * 100,
                    'payBalance': $scope.amountPayment * 100,
                    'storeOrderId': $scope.orderCode
                }
            }).success(function(data) {
                $scope.url = data.url;
                $scope.params = data.params;
                var form = $("<form method='post' id='form'></form>"),
                    input;
                form.attr({ "action": $scope.url });
                input = $("<input type='hidden'>");
                input.attr({ "name": 'param' });
                input.val($scope.params);
                form.append(input);
                form.appendTo(document.getElementById('ComInfo'));
                form.submit();
                document.getElementById('ComInfo').removeChild(form[0]);
            }).error(function() {
                my.alert('服务器请求失败');
            });
        }
        //花呗分期支付
    $scope.huabeiPre = function() {
            $ionicLoading.show({ template: '正在跳转支付宝' });
            $http({
                method: 'post',
                url: ajaxurl + 'HuaBei/test',
                data: {
                    'buyer_name': userBo.userName,
                    'buyer_card': '',
                    'subject': $scope.subject1,
                    'price': $scope.totalPrice,
                    'per': $scope.qishu,
                    'userId': userBo.userId,
                    'storeOrderId': $scope.orderCode
                }
            }).success(function(data) {
                $ionicLoading.hide();
                if (JSON.parse(data).code == '00') {
                    cordova.plugins.skipAppPlugin.skip(JSON.parse(data).qrcode, function(data) {
                        my.alert('花呗支付失败！');
                    })
                } else {
                    my.alert(JSON.parse(data).codeMsg);
                }
            }).error(function() {
                my.alert('服务器请求失败');
            });
        }
        // 提交订单    
    $scope.upOrd = function(amountPayable, businessId, businessName, receiveId, productList, activeId, activeName, discount, amountPayment) {
        if ($scope.defaultAdd) {
            $http({
                method: 'post',
                url: ajaxurl + 'ehOrder/createEhOrder?token=' + $rootScope.token,
                data: {
                    amountPayable: $scope.amountPayment,
                    businessId: 1,
                    businessName: "号码之家",
                    receiveId: $scope.defaultAdd.id,
                    productList: JSON.stringify($scope.proLis),
                    activeId: $scope.activeId,
                    activeName: $scope.activeName,
                    discount: $scope.discount,
                    amountPayment: $scope.totalPrice
                }

            }).success(function(data) {
                $scope.carList = [];
                $scope.orderCode = data;
                var confirmPopup = $ionicPopup.confirm({
                    title: '系统提示',
                    template: '确认支付？',
                    buttons: [{
                            text: '取消',
                            onTap: function() {

                                $state.go("market-myord", {});
                            }
                        },
                        {
                            text: '<b>确定</b>',
                            type: 'button-positive',
                            onTap: function() {
                                // 微信支付成功
                                if ($scope.tag.current == 1) {
                                    $scope.wexinPay();
                                } else if ($scope.tag.current == 2) {
                                    $scope.woPay();
                                } else if ($scope.tag.current == 3) {
                                    $scope.huabeiPre();
                                }
                                // $scope.getData();	
                            }
                        },
                    ]

                });



            }).error(function() {
                my.alert("遇到问题，请重试！！！");
            });
        } else {
            my.alert('请先填写收货地址');
        }


    }


    //立即购买按钮进入订单
    //	$scope.getData = function(productCode){
    //		$http({
    //			   method:'GET',
    //                  url:ajaxurl + 'ehOrder/buy?token=' + $rootScope.token,
    //                  params:{
    //                		productCode:productCode
    //			
    //			}
    //		}).success(function(data){
    //				$scope.loading=false;
    //				$scope.productList=data.productList;
    ////		
    //				$scope.totalPrice=$scope.productList[0].price * $scope.productList[0].nums;
    //		}).error(function(){
    //			
    //		});
    //	};       


    //	判断执行进入订单方式
    //	$scope.byJudge=function(){
    //		if($scope.productCode!=''){
    //			$scope.getData($scope.productCode);
    //		
    //		}else{
    //			 $scope.getLists($scope.cartIdArray);
    //		}
    //	}
    //	$scope.byJudge();
    //
    //




    //查询默认收货地址
    // $scope.getDefaultAdds=function(){
    // 	$http({
    //         method:'GET',
    //         url:ajaxurl + 'ehUser/defaultReceive?token=' + $rootScope.token
    // 	}).success(function(data){
    // 		if(data.receive!=null){
    // 			$scope.ifShowChoose=false;
    // 		}
    // 		$scope.receive=data.receive;
    // 		$scope.receiveId=data.receive.id;
    //     }).error(function(){
    // 		my.alert("遇到问题，请重试333");
    // 	});


    // }

    // $scope.getDefaultAdds();


    //支付吗？
    //$scope.toPay=function(){
    //	
    //	$scope.showConfirm("确认支付？");
    //}



});