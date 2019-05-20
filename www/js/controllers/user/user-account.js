/***账户***/
appControllers.controller('userAccount', function($scope, $http, $state, $rootScope, my) {
    $scope.title = '账户余额';
    $scope.balance = localStorage.getItem('userBalance');
    $http({
        method: 'GET',
        url: ajaxurl + "/userApp/toMyView?token=" + $rootScope.token,
    }).success(function(data) {
        // console.log(JSON.stringify(data))
        $scope.balance = data.shopBo.amount;
        //虚拟走账的账户，把c工号充值界面关掉
        if (data.user.isVirtual == "000001") {
            if (data.user.userType == "000005") {}
        } else {
            if ($scope.balance < 0) {
                $scope.balance = 0.00;
            }
        }
    }).error(function() {
        my.alert('用户信息获取服务器连接失败,请稍后再试!');
    });

    $scope.order = function() {
        $state.go("accountRecharge");
        // if(userBo.testTag == "000001"){
        // 	$state.go("accountRecharge");
        // }else{
        // 	my.alert('未走账用户无法充值，请联系上级代理商进行设置!');
        // }
    }
})

/***充值***/
appControllers.controller('accountRecharge', function($scope, $state, $http, $ionicPopup, $rootScope) {
    $scope.title = '充值';
    $scope.resState = true;
    $scope.balance = '0.00';
    $scope.input = { amount: '' };
    $http({
        method: 'GET',
        url: ajaxurl + "/userApp/toMyView?token=" + $rootScope.token,
    }).success(
        function(data) {
            $scope.balance = data.shopBo.shopBalance;
        }
    ).error(function() {
        $ionicPopup.alert({ title: '提示', template: '用户信息获取服务器连接失败,请稍后再试!', okText: '我知道了', okType: 'button-calm' });
    });
    //金额判断
    $scope.enterAmount = function() {
            if ($scope.input.amount == '' || $scope.input.amount.replace(/[1-9][0-9]*$/, "") || $scope.input.amount > 10000) {
                $scope.resState = true;
            } else {
                $scope.resState = false;
            }
        }
        //下一步选择支付方式
    $scope.next = function() {
        localStorage.setItem('rechargeAmount', $scope.input.amount);
        $state.go('payment');
    }
})

/***支付方式***/
appControllers.controller('payment', function($scope, $rootScope, $http, $ionicPopup, $state, $ionicLoading, $timeout) {
        $scope.title = '支付方式';
        $scope.resState = false;
        $scope.loading = false;
        $scope.rechargeAmount = localStorage.getItem('rechargeAmount');
        var rsa = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCp/ZtjzpmiaKOwhMLu88TSd1rUderVEin6atzmJ8+CwjzbhuWgnuII1kSwF8KtRSli0M8AH2qlpV1z6tYiUwBh764Bi0DuS3j4kiNSRrBGm20CNI+CDb8Od9I7sjhJAaJFL7MxK+zaKGXrwe92QCrx0mkyTzvD52Gna50SNfbf33MbSH+OcCXUkE67cmhFGvXYfajK7mv8T7D5goWpLv9q6WsNtOFr995PmuQrAJkcVFfM7FD+Ful3EyISAUufH5w9RCx0SPBCZzfoYvLOxsfzHQu4zmRwzNyrGSeYHbucIgbK7i9c/4mN9E4ClMDbkOjYJF39sCh8oSbcg5w3FhNdAgMBAAECggEAaHqO/xEELGXT9bIjfWomFpV1JhAzfTHkyxzTGEJvsBZiASswB0Cf/H51SSXRaV2QykM8dv7YNWclwREc+4u4OHlvoVNNXSjV+TEYtIDt5vewUCKt8WkxfFr4w+gN4BE5Av0GTbqJoKwjuHtCCpP10RtZvKomOYoE4zmpGIBCc+WGWKJCZ5kLcd2LlyjIx3+jooTSyCs0X+w+K+t95tXRlQdgeT6IU1juGQuBshMIkiAHZgTCe6NRtV0WTtfpcCTBRXM2L2qOl8mNmDI3qlfS/NtBz4dmOruKJDTIgOu//icK35fjOapHM/dIIYyAMsN8G+RAadSZXR6iilxHa6nxAQKBgQD3WLB9BH1OY2L5bk+gKk31PmZFmYZYlcXXB6JnAByeZaUgaikd0I8smyc5smgAwR3EW64niiFa5WnzN9ZbBOsOXVFfAxZrjRyjfcbhhezagX3J609CrXknfa2UkBVCR8z0Shq56TSpP/VDsouGRU57M83Nb9qp3RmiaLZvZeo7JQKBgQCv8BhsO19f1prRE6d8MVJyu7JGlj5AyNDxiRNB4W8qs3PYvn/oTfcmbizSmjmM/DuMijtPvG0OsRcVqM83H22ko5FpuF/VR/nBGOeFYizE/jeYK0vYLZRzviEb0QspsgtKfcIAWTeGRVzFT9qlAiCSwxi1/Mt1QcXaunt1ER/d2QKBgQDsMpY+nCXo0EG4fV2uThep5M+XERdYypVlVNYB0/qATAJWpOnknb/LUdIwZ6ynY8LAOuhgu6hEe6UkbCLXQigQzI4i0/j59YPun/JmdBSNSHDNfFZxDuUOEBbNMpYKeDRA5+8Dr63pHblhz0Mrkk1ymzKhRnoiEZAkJiho0oLNvQKBgAlya+1L1tgvjsqRMpoRj+rHN1Bg+uDBp66AfL852p1BW4QU3otbvFyc5907GMIAPTZTqdGjPXvfeGzaTp4YGuwPOFyj4Mlz/u4mZzAbUGoXeGa8VGs8L09zsxVqSR4pCEAstoEMSVX1XYDew8++aH9Y6HfFJiuap4QSJVTo4XwpAoGAXwPzFSpQpqllC+RZ0Q9LrFdNx0tnS1xR15DkWweZYPkuGSLgKI/n+wGSm81DOZ+WPpQLgMhq3yIvpkdveuudTU9Cj+Scw+UX5sCZy70xNUh+FBNks3/a4VBLmOJhTIa5Ccij2sXILhSr3bvySRWEUtuxUOe4ES3yjChp54qtxY0=";
        var out_trade_no;
        $scope.pay = function() {
            $scope.resState = true;
            $scope.loading = true;
            var callbackInfo;
            $('.payType input:radio:checked').each(function() {
                if ($(this).val() == '微信支付') {
                    navigator.weixin.sendPayReq({
                        "appid": "wxab73944d08b342cf",
                        "urlString": "http://z.haoma.cn/tms-app-war/rechargeApp/shopBalanceChargePrecommitForApp",
                        "method": "post",
                        "data": {
                            "amount": $scope.rechargeAmount,
                            "token": $rootScope.token,
                            "mchId": "1461428102",
                            "appId": "wxab73944d08b342cf"
                        }
                    }, function(retcode) {
                        $scope.resState = false;
                        $scope.loading = false;
                        if (retcode == '0') {
                            callbackInfo = "支付成功";
                            $timeout(function() {
                                $ionicLoading.hide();
                            }, 2000).then(function() {
                                $state.go('userCenter');
                            });
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
                        $scope.resState = false;
                        $scope.loading = false;
                        if (message == '-2') {
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
                    });
                } else if ($(this).val() == '支付宝支付') {
                    $http({
                        method: 'GET',
                        url: "http://z.haoma.cn/tms-app-war/rechargeApp/insertShopBalanceChargeForAlipay?token=" + $rootScope.token + "&amount=" + $scope.rechargeAmount,
                    }).success(
                        function(data) {
                            out_trade_no = data.outTradeNo;
                            navigator.alipay.pay({
                                "appID": "2017041406723204", //商户ID
                                "rsa_private": rsa, //私钥
                                "seller": "764077159@qq.com", //收款支付宝账号或对应的支付宝唯一用户号
                                "subject": "号码之家", //商品名称
                                "body": "号码之家-虚拟产品", //商品详情
                                "price": $scope.rechargeAmount, //金额
                                "timeout": "30m", //超时设置
                                "out_trade_no": out_trade_no,
                                "appScheme": "zxAlipay",
                                "notifyUrl": "http://z.haoma.cn/tms-app-war/rechargeApp/shopBalanceChargePrecommitForAlipay"
                            }, function(resultStatus) {
                                $scope.resState = false;
                                $scope.loading = false;
                                if (resultStatus == '9000') {
                                    callbackInfo = "支付成功";
                                    $timeout(function() {
                                        $ionicLoading.hide();
                                    }, 2000).then(function() {
                                        $state.go('userCenter');
                                    });
                                } else if (resultStatus == '8000') {
                                    callbackInfo = "正在处理中...";
                                } else if (resultStatus == '4000') {
                                    callbackInfo = "支付失败";
                                } else if (resultStatus == '5000') {
                                    callbackInfo = "重复请求";
                                } else if (resultStatus == '6001') {
                                    callbackInfo = "中途取消";
                                } else if (resultStatus == '6002') {
                                    callbackInfo = "网络连接出错";
                                } else if (resultStatus == '6004') {
                                    callbackInfo = "支付结果未知";
                                } else if (resultStatus == '其他') {
                                    callbackInfo = "未知错误";
                                }
                                $ionicLoading.show({
                                    template: callbackInfo
                                });
                                $timeout(function() {
                                    $ionicLoading.hide();
                                }, 2000);
                            }, function(message) {
                                $scope.resState = false;
                                $scope.loading = false;
                                callbackInfo = "支付失败";
                            });

                        }).error(function(error) {
                        $scope.resState = false;
                        $scope.loading = false;
                        $ionicPopup.alert({
                            title: '系统提示',
                            template: '支付失败',
                            okType: 'button-default',
                            okText: '我知道了'
                        });
                    });
                }
            });
        }
    })
    /***佣金记录表***/
appControllers.controller('commissionRecord', function($scope, $http, $rootScope) {
        $scope.title = '佣金记录';
        $scope.recordList = [];
        $scope.infoState = '加载更多';
        $scope.raiseStyle = false;
        $scope.loading = true;
        $scope.readMore = true;
        $scope.noMoreTips = true;
        $scope.pageIndex = 1;
        $scope.pageSize = '';
        $scope.pageCount = '';
        var category = {
            "000001": "余额充值",
            "000002": "号码开卡",
            "000003": "话费充值",
            "000004": "流量充值",
            "000005": "开卡佣金",
            "000006": "余额提现",
            "000007": "退款",
            "000008": "联通充值",
        };
        var incomeExpenditure = {
            "000001": "\u002b",
            "000002": "\u002d",
        };
        //数据信息展示
        $http({
            method: "GET",
            url: ajaxurl + '/userApp/queryShopOrderCommissionList?token=' + $rootScope.token,
        }).success(function(data) {
            //console.log(JSON.stringify(data));
            $scope.readMore = false;
            for (var i in data["commissionList"]) {
                var ii = data["commissionList"][i];
                ii["category"] = category[ii["category"]];
                ii["side"] = incomeExpenditure[ii["side"]];
                //console.log(i+"===="+ii["amount"]);
                if (ii["amount"] == null) {
                    ii["amount"] = 0;
                }
                $scope.recordList.push(ii);
            }
            $scope.pageIndex = data.page.pageIndex;
            $scope.pageSize = data.page.pageSize;
            $scope.pageCount = data.page.pageCount;
            loadingState($scope.pageCount, $scope.pageSize);
            //加载
            $scope.loadMoreData = function() {
                loadMore($scope.pageCount, $scope.pageSize);
            };
        });
        //加载更多
        function loadMore(pageCount, pageSize) {
            if ($scope.pageIndex < Math.ceil(pageCount / pageSize)) {
                $scope.loading = false;
                $scope.pageIndex++;
                $http({
                    method: 'GET',
                    url: ajaxurl + 'userApp/queryShopOrderCommissionList?token=' + $rootScope.token,
                    params: { pageIndex: $scope.pageIndex }
                }).success(function(data) {
                    $scope.loading = true;
                    for (var i in data["commissionList"]) {
                        var ii = data["commissionList"][i];
                        ii["category"] = category[ii["category"]];
                        ii["side"] = incomeExpenditure[ii["side"]];
                        $scope.recordList.push(ii);
                    }
                }).error(function() {

                });
            } else {
                $scope.infoState = '没有更多了';
                $scope.readMore = true;
                $scope.noMoreTips = false;
            }

        }
        //判断加载与否状态
        function loadingState(pageCount, pageSize) {
            if (pageCount > pageSize) {
                $scope.infoState = '加载更多';
            } else {
                $scope.infoState = '没有更多了';
                $scope.readMore = true;
                $scope.noMoreTips = false;
            }
        }
    })
    /***交易明细列表***/
appControllers.controller('transactionRecord', function($scope, $http, $state, $rootScope) {
        $scope.title = '交易明细';
        $scope.transactionList = [];
        $scope.infoState = '加载更多';
        $scope.loading = true;
        $scope.pageIndex = 1;
        $scope.pageSize = '';
        $scope.pageCount = '';
        $scope.side = '';
        $scope.transactionType = 'Test';
        $scope.readMore = true;
        var category = {
            "000001": "余额充值",
            "000002": "号码开卡",
            "000003": "话费充值",
            "000004": "流量充值",
            "000005": "开卡佣金",
            "000006": "余额提现",
            "000007": "退款",
            "000008": "联通充值",
        };
        var incomeExpenditure = {
            "000001": "\u002b",
            "000002": "\u002d",
        };
        $scope.item = {
            current: "1"
        };
        $scope.actions = {
            setCurrent: function(param) {
                $scope.item.current = param;
                $scope.loading = true;
                $scope.readMore = true;
                if (param == '1') {
                    $scope.transactionList = [];
                    queryRecord();
                    $scope.loadMoreData = function() {
                        loadMore($scope.pageCount, $scope.pageSize);
                    }
                } else if (param == '2') {
                    $scope.transactionList = [];
                    queryRecord('000001');
                    $scope.loadMoreData = function() {
                        loadMore($scope.pageCount, $scope.pageSize, '000001');
                    }
                } else if (param == '3') {
                    $scope.transactionList = [];
                    queryRecord('000002');
                    $scope.loadMoreData = function() {
                        loadMore($scope.pageCount, $scope.pageSize, '000002');
                    }
                }
            }
        };

        function queryRecord(e) {
            $http({
                method: 'GET',
                url: ajaxurl + '/userApp/queryShopFlowList?token=' + $rootScope.token,
                params: { side: e }
            }).success(function(data) {
                $scope.loading = false;
                $scope.readMore = false;
                //console.log(JSON.stringify(data));

                for (var i in data['flowList']) {
                    var ii = data['flowList'][i];
                    ii["category"] = category[ii["category"]];
                    ii["side"] = incomeExpenditure[ii["side"]];
                    $scope.transactionList.push(ii);
                    //console.log("xixi==="+ii["side"]);
                    if (data['flowList'][i].side == '+') {
                        data['flowList'][i].incomeMoney = true;
                        data['flowList'][i].expendMoney = false;
                    } else {
                        data['flowList'][i].expendMoney = true;
                        data['flowList'][i].incomeMoney = false;
                    }
                }
                $scope.pageIndex = data.page.pageIndex;
                $scope.pageSize = data.page.pageSize;
                $scope.pageCount = data.page.pageCount;
                //加载
                $scope.loadMoreData = function() {
                    loadMore($scope.pageCount, $scope.pageSize, e);
                }
            }).error(function() {

            });
        }
        queryRecord();
        //加载更多
        function loadMore(pageCount, pageSize, type) {
            if ($scope.pageIndex < Math.ceil(pageCount / pageSize)) {
                $scope.loading = true;
                $scope.pageIndex++;
                $http({
                    method: 'GET',
                    url: ajaxurl + '/userApp/queryShopFlowList?token=' + $rootScope.token,
                    params: { pageIndex: $scope.pageIndex, side: type }
                }).success(function(data) {
                    $scope.loading = false;
                    for (var i in data['flowList']) {
                        var ii = data['flowList'][i];
                        ii["category"] = category[ii["category"]];
                        ii["side"] = incomeExpenditure[ii["side"]];
                        $scope.transactionList.push(ii);
                        if (data['flowList'][i].side == '+') {
                            data['flowList'][i].incomeMoney = true;
                            data['flowList'][i].expendMoney = false;
                        } else {
                            data['flowList'][i].expendMoney = true;
                            data['flowList'][i].incomeMoney = false;
                        }
                    }
                }).error(function() {

                });
            } else {
                $scope.infoState = '没有更多了';
            }
        }
        //交易详情
        $scope.recordDetail = function() {
            order["orderCode"] = arguments[0];
            $state.go("transactionRecordDetail");
        }
    })
    /***交易明细详情***/
appControllers.controller('transactionRecordDetail', function($scope, $ionicPopup, $http, $rootScope, $filter) {
    $scope.title = '交易详情';
    $scope.loading = true;
    $http({
        method: 'GET',
        url: ajaxurl + "/userApp/queryFlowDetail?token=" + $rootScope.token,
        params: { flow: order["orderCode"] }
    }).success(function(data) {
        $scope.loading = false;
        //console.log(JSON.stringify(data));
        if (data.flowBo.side == '000001') {
            $scope.side = '+';
            $scope.incomeMoney = true;
        }
        if (data.flowBo.side == '000002') {
            $scope.side = '-';
            $scope.expendMoney = true;
        }
        $scope.amount = data.flowBo.amount;
        if (data.flowBo.category == '000001') {
            $scope.category = '余额充值';
        } else if (data.flowBo.category == '000002') {
            $scope.category = '号码开卡';
        } else if (data.flowBo.category == '000003') {
            $scope.category = '话费充值';
        } else if (data.flowBo.category == '000004') {
            $scope.category = '流量充值';
        } else if (data.flowBo.category == '000005') {
            $scope.category = '开卡佣金';
        } else if (data.flowBo.category == '000006') {
            $scope.category = '余额提现';
        } else if (data.flowBo.category == '000007') {
            $scope.category = '退款';
        } else if (data.flowBo.category == '000008') {
            $scope.category = '联通充值';
        }
        $scope.createTime = $filter('date')(data.flowBo.createTime, 'yyyy-MM-dd HH:mm:ss');;
        $scope.accountFlow = data.flowBo.orderCode;
        //待发布版本后处理....
    }).error(function() {
        $ionicPopup.alert({
            "title": '提示',
            "template": '获取详情信息失败!',
            "okText": '我知道了',
            "okType": 'button-default'
        });
    });
})