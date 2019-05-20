appControllers.controller('market-ordinfo', function($scope, $http, $rootScope, my, $stateParams, $ionicLoading, $state, $ionicPopup) {
    $scope.title = '订单详情';
    $scope.orderCode = $stateParams.orderCode;
    $scope.orderId = $stateParams.orderId;
    $scope.status = $stateParams.status;
    $scope.expressCompany = '';
    $scope.expressNo = '';
    $scope.status = $stateParams.status;
    $scope.actualAmount = 0;
    $scope.payType = '微信';
    $scope.bottomStrip = true;
    $scope.boa = {};
    $scope.bob = {};
    $scope.HuabeiStag = false;
    $scope.subject = [];
    $scope.qishu = 12;
    $scope.payOrderCode = '';
    $scope.actualAmount = null;

    $scope.getData = function(orderCode) {
        $http({
            method: 'GET',
            url: ajaxurl + 'ehOrder/findOneEhOrder?token=' + $rootScope.token,
            params: {
                orderCode: orderCode
            }
        }).success(function(data) {
            $scope.ordInfo = data;
            for (var i in $scope.ordInfo.orderItemList) {
                $scope.actualAmount += $scope.ordInfo.orderItemList[i].price;
            }
            $scope.businessName = data.businessName;
            $scope.subject = data.orderItemList;
            $scope.payOrderCode = data.orderCode;
            $scope.actualAmount = data.amountPayable;
        }).error(function() {
            my.alert("遇到问题，请重试!");
        });
    }
    $scope.getData($scope.orderCode);
    //再次购买
    $scope.buyAgain = function(e) {
            $scope.orderItemList = $scope.ordInfo.orderItemList;
            $state.go('market-goods', { 'productCode': $scope.orderItemList[e].productCode });
        }
        //立即评价
    $scope.evalNow = function() {
            $state.go("market-eval", { 'orderCode': $scope.orderCode });
        }
        //
        // //顺丰快递速运查询异常   
        // $scope.checkPost=function(expressCompany,expressNo){
        // 		$http({
        //             method:'GET',
        //             url:ajaxurl + 'ehOrder/queryKuaidi?token=' + $rootScope.token,
        //             params:{ 
        //             	expressCompany:"shunfeng",
        //             	expressNo:"889493679937"
        //             }
        //             }).success(function(data){ 
        //          	   $state.go("market-logistics",{orderCode:"$scope.orderCode"});
        //             }).error(function(){   
        // 				my.alert("遇到问题,请重试！");
        // 			});
        // }  



    //*** 提醒发货 ***
    $scope.remind = function(e, orderId, status) {
        //   	$scope.orderId=$scope.orderList[e].id;
        // $scope.status=$scope.orderList[e].status;
        $http({
            method: 'GET',
            url: ajaxurl + 'ehAdmin/updateOrderStatus?token=' + $rootScope.token,
            params: {
                orderId: $scope.orderId,
                status: "000018"
            }
        }).success(function(data) {
            my.alert("已提醒商家发货，请您耐心等待");
        }).error(function() {
            my.alert("遇到问题，提醒商家发货失败，请重试");
        });
    }




    //未发货 申请售后   
    $scope.applyServ = function(orderId, status) {
        $http({
            method: 'GET',
            url: ajaxurl + 'ehAdmin/updateOrderStatus?token=' + $rootScope.token,
            params: {
                orderId: $scope.orderId,
                status: "000006"
            }
        }).success(function(data) {
            my.alert("已帮您申请售后，请您保持电话通畅，以便我们的客服稍后联系到您");
        }).error(function() {
            my.alert("遇到问题，请重新尝试!");
        });
    }




    // 已发货 申请售后   
    $scope.applyServSend = function(orderId, status) {
        $http({
            method: 'GET',
            url: ajaxurl + 'ehAdmin/updateOrderStatus?token=' + $rootScope.token,
            params: {
                orderId: $scope.orderId,
                status: "000007"
            }
        }).success(function(data) {
            my.alert("已帮您申请售后，请您保持电话通畅，以便我们的客服稍后联系到您");
        }).error(function() {
            my.alert("遇到问题，请重新尝试!");
        });
    }



    //取消订单      
    $scope.delOrder = function(orderId, status) {
        $http({
            method: 'get',
            url: ajaxurl + 'ehAdmin/updateOrderStatus?token=' + $rootScope.token, //取消订单接口
            params: {
                orderId: $scope.orderId,
                status: "000012"
            }
        }).success(function(data) {
            my.alert("已帮您取消该笔订单！");
        }).error(function() {
            my.alert("遇到问题，请重新尝试！");
        });
    }




    //*** 确认收货 ***
    $scope.isGetOk = function(e, orderId, status) {
        //   	$scope.orderId=$scope.orderList[e].id;
        // $scope.status=$scope.orderList[e].status;
        $http({
            method: 'GET',
            url: ajaxurl + 'ehAdmin/updateOrderStatus?token=' + $rootScope.token,
            params: {
                orderId: $scope.orderId,
                status: "000004"
            }
        }).success(function(data) {
            my.alert("确认收货成功");
        }).error(function() {
            my.alert("遇到问题，确认收货失败，请重试");
        });
    }






    //微信支付
    $scope.wxPay = function() {
            // 微信支付成功
            navigator.weixin.sendPayReq({
                "appid": "wxab73944d08b342cf",
                "urlString": "http://z.haoma.cn/tms-app-war/ehOrder/pay",
                "method": "post",
                "data": {
                    "orderCode": $scope.payOrderCode,
                    "amountPayable": $scope.actualAmount,
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
        //沃支付支付
    $scope.woPay = function() {
            $http({
                method: 'post',
                url: ajaxurl + 'epay/getSignString?token=' + $rootScope.token,
                data: {
                    'orderBalance': $scope.amountPayment * 100,
                    'payBalance': $scope.actualAmount * 100,
                    'storeOrderId': $scope.payOrderCode
                }
            }).success(function(data) {
                $scope.url = data.url;
                $scope.params = data.params;
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
        /*付款*/
    $scope.toOrd = function(e) {
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
                        //               	//未支付
                        // $http({
                        //   		method:'post',
                        //                  url:ajaxurl + 'ehOrder/createEhOrder?token=' + $rootScope.token,
                        //                  data:{
                        //                		"amountPayable":$scope.amountPayment,
                        //                		"businessId":1,
                        //                		"businessName":"号码之家",
                        //                		"receiveId":$scope.defaultAdd.id,
                        //                		"productList":JSON.stringify($scope.proLis),
                        //                		"activeId":$scope.activeId,
                        //  				"activeName":$scope.activeName,
                        // 				    "discount":$scope.discount,
                        // 				    "amountPayment":$scope.totalPrice

                        // 		}
                        // 	}).success(function(data){
                        // 			$scope.carList=[];


                        if ($scope.tag.current == 1) {
                            $scope.wxPay();
                        } else if ($scope.tag.current == 2) {
                            $scope.woPay();
                        }

                        $scope.getData($scope.orderCode);

                        // });		
                    }
                },
            ]

        });

    }


    //打开选择支付方式页面
    $scope.chosePayType = function() {
            $scope.showPayType = true;
            $scope.ifShowCar = false;
            $scope.bottomStrip = false;
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
                            $scope.showHuabeiPre = true;
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
        //选择支付类型
    $scope.tag = {
        current: 1
    };
    $scope.payOrdType = function(params) {
            $scope.tag.current = params;
            if (params == 1) {
                $scope.payType = '微信';
                $scope.ifShowCar = true;
                $scope.showPayType = false;
                $scope.bottomStrip = false;
            } else if (params == 2) {
                $scope.payType = '沃支付';
                $scope.ifShowCar = true;
                $scope.showPayType = false;
                $scope.bottomStrip = false;
            } else if (params == 3) {
                $scope.payType = '花呗分期';
                $scope.showPayType = true;
                $scope.judgeExitHuabei();
            }
        }
        // 选择支付方式
    $scope.toPay = function(e) {
            $scope.ifShowCar = true;
            $scope.bottomStrip = false;
        }
        //关闭付款遮罩层
    $scope.closeCar = function() {
            $scope.ifShowCar = false;
            $scope.bottomStrip = true;
        }
        //关闭付款类型遮罩层
    $scope.closePayType = function() {
            $scope.showPayType = false;
            $scope.bottomStrip = true;
        }
        //选择花呗分期期数
    $scope.showHuabeiStag = function() {
            $scope.showPayType = false;
            $scope.HuabeiStag = true;
        }
        //关闭花呗分期选择页面
    $scope.closehuabeiPre = function() {
            $scope.HuabeiStag = false;
            $scope.bottomStrip = true;
        }
        //选择花呗分期期数
    $scope.choseHuabeiStag = function() {
        $scope.showPayType = false;
        $scope.HuabeiStag = true;
        //获取花呗分期详情
        $http({
            "method": 'post',
            "url": ajaxurl + 'HuaBei/calculation',
            "data": { 'price': $scope.actualAmount }
        }).success(function(data) {
            if (data) {
                $scope.boa = data.boa;
                $scope.bob = data.bob;
                $scope.tag1 = {
                    current1: true
                };
                $scope.platformBill = $scope.boa.platformBill;
                $scope.allServiceCharge = $scope.boa.allServiceCharge;
                $scope.total = $scope.boa.total;
            }
        }).error(function(data) {
            my.alert('服务器请求失败').then(function() {

            });
        });
    }

    //切换花呗分期
    $scope.switchPer = function(params) {
        if (params == 1) {
            $scope.qishu = 12;
            $scope.tag1.current1 = true;
            $scope.tag1.current2 = false;
            $scope.platformBill = $scope.boa.platformBill;
            $scope.allServiceCharge = $scope.boa.allServiceCharge;
            $scope.total = $scope.boa.total;
        } else if (params == 2) {
            $scope.qishu = 24;
            $scope.tag1.current1 = false;
            $scope.tag1.current2 = true;
            $scope.platformBill = $scope.bob.platformBill;
            $scope.allServiceCharge = $scope.bob.allServiceCharge;
            $scope.total = $scope.bob.total;
        }
    }

    //花呗结账
    $scope.huabeiPurche = function() {
        $ionicLoading.show({ template: '正在跳转支付宝' });
        $scope.subject1 = '';
        for (var i in $scope.subject) {
            $scope.subject1 += $scope.subject[i].keywords + '——';
        }
        $http({
            method: 'post',
            url: ajaxurl + 'HuaBei/test',
            data: {
                'buyer_name': userBo.userName,
                // 'buyer_name':'李超',
                'buyer_card': '',
                'subject': $scope.subject1,
                // 'subject': '苹果',
                'price': $scope.actualAmount,
                'per': $scope.qishu,
                'userId': userBo.userId,
                'storeOrderId': $scope.payOrderCode
            }
        }).success(function(data) {
            $ionicLoading.hide();
            if (JSON.parse(data).code == '00') {
                //跳转支付宝
                cordova.plugins.skipAppPlugin.skip(JSON.parse(data).qrcode, function(data) {
                        my.alert('花呗支付失败！');
                    })
                    // $scope.link(JSON.parse(data).qrcode);
            } else {
                my.alert(JSON.parse(data).codeMsg);
            }
        }).error(function() {
            my.alert('服务器请求失败');
        });
    }



});