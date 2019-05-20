appControllers.controller('unicom-order-user', function($scope, $filter, my, $http, $state, $ionicPopup, $rootScope, $ionicLoading) {
    $scope.title = '联通商城装机订单';
    $scope.orderList = [];
    // $rootScope = loginInfo;
    $scope.userId = '';
    $scope.isNoShowStatePop = false;
    $scope.isNoShowAssignPop = false;
    $scope.isNoShowChosePop = false;
    $scope.isNoShowChannelList = false;
    $scope.isNoShowStateList = false;
    $scope.isNoShowMallBot = true;
    $scope.nowDate = new Date().getTime();
    //console.log("?! "+$scope.nowDate);
    //初始化参数
    $scope.pageSize = 6;
    $scope.pageIndex = 1;
    $scope.keywords = '';
    $scope.status = '000000';
    $scope.cUserId = '';
    $scope.bespeakId = '';
    $scope.orderId = '';
    $scope.userName = '';
    $scope.getStartTime = GetDateStr(-30);
    $scope.getEndTime = GetDateStr(1);
    $scope.channelList = [{ "name": "王苗", "num": "0", "userId": "12270 " }, { "name": "张宇", "num": "1", "userId": '13222' }];
    $scope.stateList = [{ "name": "已派单", "num": "0", "status": "000003" }, { "name": "受理中", "num": "1", "status": "000007" },
        { "name": "装机成功", "num": "2", "status": "000004" }, { "name": "用户取消", "num": "3", "status": "000006" }
    ];
    //获取数据
    $scope.getDate = function(userId, pageSize, pageIndex, startTime, endTime, keywords, status, cUserId) {
        // $ionicLoading.show({template: '数据加载中...'});
        $scope.loading = true;
        $scope.noMore = false;
        $http({
            method: 'post',
            url: ajaxurl + 'unicomMallLanApp/queryUnicomMallLanOrderListForUser?token=' + $rootScope.token,
            data: {
                startTime: startTime,
                endTime: endTime,
                pageSize: pageSize,
                pageIndex: pageIndex,
                userId: userId,
                keywords: keywords,
                status: status,
                cUserId: cUserId,
                source: '000001'
            },
            timeout: 5000
        }).success(function(data) {
            // $ionicLoading.hide();
            $scope.loading = false;
            // console.log("aaa=="+JSON.stringify(data)); 
            $scope.orderList = $scope.orderList.concat(data.orderList);
            for (var i in $scope.orderList) {
                // $scope.status = $scope.orderList[i].status;
                if ($scope.orderList[i].status == "000004" || $scope.orderList[i].status == "000006") {
                    $scope.orderList[i].isNoShowMallBot = false;
                } else {
                    $scope.orderList[i].isNoShowMallBot = true;
                }
                //激活状态
                if ($scope.orderList[i].orderState == null) {
                    $scope.orderList[i].orderState = '未处理';
                } else if ($scope.orderList[i].orderState == '00') {
                    $scope.orderList[i].orderState = '未处理';
                } else if ($scope.orderList[i].orderState == '01') {
                    $scope.orderList[i].orderState = '激活成功';
                } else if ($scope.orderList[i].orderState == '02') {
                    $scope.orderList[i].orderState = '退单';
                } else if ($scope.orderList[i].orderState == '03') {
                    $scope.orderList[i].orderState = '退款';
                }
            }
            // alert( $scope.status);
            if (eval(data.orderList).length < data.page.pageSize) {
                $scope.hasmore = false;
                $scope.noMore = true;
            } else {
                $scope.hasmore = true;
            }
            for (var i in $scope.orderList) {
                $scope.orderList[i].stateNum = i;
                if ($scope.orderList[i].status === '000006') {
                    $scope.orderList[i].statusVal = '用户取消';
                    $scope.orderList[i].verifyColor = false;
                    $scope.orderList[i].successColor = false;
                    $scope.orderList[i].failColor = false;
                    $scope.orderList[i].cancelColor = false;
                    $scope.orderList[i].signatureColor = false;
                    $scope.orderList[i].dealColor = true;
                    $scope.orderList[i].isNoShowReminser = false;
                } else if ($scope.orderList[i].status === '000001') {
                    $scope.orderList[i].statusVal = '未处理';
                    $scope.orderList[i].verifyColor = false;
                    $scope.orderList[i].successColor = false;
                    $scope.orderList[i].failColor = false;
                    $scope.orderList[i].cancelColor = false;
                    $scope.orderList[i].signatureColor = false;
                    $scope.orderList[i].dealColor = true;
                    $scope.orderList[i].isNoShowReminser = false;
                } else if ($scope.orderList[i].status === '000002') {
                    $scope.orderList[i].statusVal = '有效订单';
                    $scope.orderList[i].verifyColor = true;
                    $scope.orderList[i].successColor = false;
                    $scope.orderList[i].failColor = false;
                    $scope.orderList[i].cancelColor = false;
                    $scope.orderList[i].signatureColor = false;
                    $scope.orderList[i].dealColor = false;
                    $scope.orderList[i].isNoShowReminser = false;
                } else if ($scope.orderList[i].status === '000003') {
                    $scope.orderList[i].statusVal = '已派单';
                    $scope.orderList[i].stateVal = '受理';
                    $scope.orderList[i].verifyColor = false;
                    $scope.orderList[i].successColor = true;
                    $scope.orderList[i].failColor = false;
                    $scope.orderList[i].cancelColor = false;
                    $scope.orderList[i].signatureColor = false;
                    $scope.orderList[i].dealColor = false;
                    if ($scope.nowDate - $scope.orderList[i].updateTime > 14400000) {
                        $scope.orderList[i].reminderVal = "超时";
                        $scope.orderList[i].isNoShowReminser = true;
                    } else {
                        $scope.orderList[i].isNoShowReminser = false;
                    }
                } else if ($scope.orderList[i].status === '000005') {
                    $scope.orderList[i].statusVal = '已退单';
                    $scope.orderList[i].verifyColor = false;
                    $scope.orderList[i].successColor = false;
                    $scope.orderList[i].failColor = true;
                    $scope.orderList[i].cancelColor = false;
                    $scope.orderList[i].signatureColor = false;
                    $scope.orderList[i].dealColor = false;
                    $scope.orderList[i].isNoShowReminser = false;
                } else if ($scope.orderList[i].status === '000004') {
                    $scope.orderList[i].statusVal = '装机成功';
                    $scope.orderList[i].verifyColor = false;
                    $scope.orderList[i].successColor = false;
                    $scope.orderList[i].failColor = false;
                    $scope.orderList[i].cancelColor = false;
                    $scope.orderList[i].signatureColor = true;
                    $scope.orderList[i].dealColor = false;
                    $scope.orderList[i].isNoShowReminser = false;
                } else if ($scope.orderList[i].status === '000007') {
                    $scope.orderList[i].statusVal = '受理中';
                    $scope.orderList[i].stateVal = '装机成功';
                    $scope.orderList[i].verifyColor = false;
                    $scope.orderList[i].successColor = true;
                    $scope.orderList[i].failColor = false;
                    $scope.orderList[i].cancelColor = false;
                    $scope.orderList[i].signatureColor = false;
                    $scope.orderList[i].dealColor = false;
                    if ($scope.nowDate - $scope.orderList[i].updateTime > 259200000) {
                        $scope.orderList[i].reminderVal = "超时";
                        $scope.orderList[i].isNoShowReminser = true;
                    } else {
                        $scope.orderList[i].isNoShowReminser = false;
                    }
                }
                // console.log("aaa=="+JSON.stringify(data));
            }
            //判断超时
            for (var i in $scope.orderList) {
                switch ($scope.orderList[i].overTimeStatus) {
                    case '000001':
                        $scope.orderList[i].isNoShowReminser = true;
                        $scope.orderList[i].reminderVal = "超时";
                        break;
                    case "000002":
                        $scope.orderList[i].isNoShowReminser = true;
                        $scope.orderList[i].reminderVal = "超时";
                        break;
                    case "000003":
                        $scope.orderList[i].isNoShowReminser = true;
                        $scope.orderList[i].reminderVal = "超时";
                        break;
                    default:
                        $scope.orderList[i].isNoShowReminser = false;
                }
            }
        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。').then(function() {
                $state.go('index');
            });
        }).finally(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    $scope.getDate($scope.userId, $scope.pageSize, $scope.pageIndex, $scope.getStartTime, $scope.getEndTime, $scope.keywords, $scope.status, $scope.cUserId);
    //上拉加载
    $scope.loadMore = function() {
        $scope.pageIndex++;
        $scope.getDate($scope.userId, $scope.pageSize, $scope.pageIndex, $scope.getStartTime, $scope.getEndTime, $scope.keywords, $scope.status, $scope.cUserId);
    };
    //数据更新
    $scope.upData = function() {
            $scope.pageSize = 6;
            $scope.pageIndex = 1;
            // $scope.keywords='';
            $scope.status = '000000';
            $scope.cUserId = '';
            // $scope.bespeakId='';
            // $scope.orderId='';
            // $scope.getStartTime=GetDateStr(-6);
            // $scope.getEndTime=GetDateStr(1);
            $scope.orderList = [];
            $scope.getDate($scope.userId, $scope.pageSize, $scope.pageIndex, $scope.getStartTime, $scope.getEndTime, $scope.keywords, $scope.status, $scope.cUserId);
        }
        //取消订单
    $scope.cancelOrder = function(orderId, cancelReason, status, userName) {
            $http({
                method: 'get',
                url: ajaxurl + 'unicomMallLanApp/cancelUnicomMallLanOrder?token=' + $rootScope.token,
                params: {
                    orderId: orderId,
                    cancelReason: cancelReason,
                    status: status,
                    source: userName
                }
            }).success(function(data) {
                // console.log("?4 "+JSON.stringify(data));
                $scope.upData();
            })
        }
        //放弃弹出理由
    $scope.alertGiveUp = function(index) {
        $scope.input = {}
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="input.txt" maxlength="120" style="border:1px solid #ccc">',
            title: '系统提示',
            subTitle: '输入放弃原因',
            scope: $scope,
            buttons: [
                { text: '取消' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.input.txt) {
                            //不允许用户关闭，除非他键入wifi密码
                            e.preventDefault();
                        } else {
                            //  console.log("?5"+$scope.input.txt);
                            $scope.cancelReason = $scope.input.txt;
                            $scope.cancelOrder($scope.orderId, $scope.cancelReason, $scope.status, $scope.userName);

                        }
                    }
                },
            ]
        });
    }

    //输入装机成功宽带号
    $scope.alertLan = function() {
            $scope.input = {}
            var myPopup = $ionicPopup.show({
                template: '<input type="tel" ng-model="input.txt" maxlength="13"  style="border:1px solid #ccc">',
                title: '系统提示',
                subTitle: '输入装机成功宽带号',
                scope: $scope,
                buttons: [
                    { text: '取消' },
                    {
                        text: '<b>确定</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.input.txt) {
                                e.preventDefault();

                            } else {

                                $scope.cancelReason = $scope.input.txt;
                                if ($scope.input.txt.length < 10) {

                                    my.alert("请输入正确的装机成功宽带号");
                                } else {
                                    console.log("?5" + $scope.input.txt);
                                    $scope.cancelOrder($scope.orderId, $scope.cancelReason, $scope.status, $scope.userName);
                                }


                            }
                        }
                    },
                ]
            });
        }
        //修改订单状态
    $scope.changeOrderStatus = function(orderId, status, userName) {
            $http({
                method: 'get',
                url: ajaxurl + 'unicomMallLanApp/updateUnicomMallLanOrderByStatus?token=' + $rootScope.token,
                params: {
                    orderId: orderId,
                    status: status,
                    source: userName
                }
            }).success(function(data) {
                // console.log("修改订单 "+data);
                if (data == true) {
                    $scope.tag.current = -1;
                }
                $scope.upData();
            })
        }
        //分配数据
    $scope.AssignData = function(orderId, status, cUserId, userName) {
            $http({
                method: 'get',
                url: ajaxurl + 'unicomMallLanApp/updateUnicomMallLanOrderByStatusUser?token=' + $rootScope.token,
                params: {
                    orderId: orderId,
                    status: status,
                    cUserId: cUserId,
                    source: userName
                }
            }).success(function(data) {
                // console.log("分配成功 "+data);
                if (data == true) {
                    $scope.tag.current = -1;
                }
            })
        }
        //状态切换
    $scope.tag = {
        current: "0"
    };
    $scope.actions = {
        setCurrent: function(param) {
            $scope.tag.current = param;
        }
    };
    //未分配切换
    $scope.tag1 = {
        current: "0"
    };
    $scope.actions1 = {
        setCurrent: function(param) {
            $scope.tag1.current = param;
            switch (param) {
                case 1:
                    $scope.cUserId = '12270';
                    break;
                case 2:
                    $scope.cUserId = '12276';
                    break;
            }
        }
    };
    //网格经理查询
    $scope.tag2 = {
        current: "-1"
    };
    $scope.actions2 = {
        setCurrent: function(param) {
            $scope.tag2.current = param;
            $scope.cUserId = $scope.channelList[param].userId;
            // console.log($scope.cUserId);
        }
    };
    //状态查询
    $scope.tag3 = {
        current: "-1"
    };
    $scope.actions3 = {
        setCurrent: function(param) {
            $scope.tag3.current = param;
            $scope.status = $scope.stateList[param].status;
            // console.log($scope.status);
        }
    };
    //状态选择
    $scope.tag4 = {
        current: "-1"
    };
    $scope.actions4 = {
        setCurrent: function(param) {
            $scope.tag4.current = param;
            //  console.log("$scope.tag.current" +$scope.tag.current)
            $scope.bespeakId = $scope.orderList[$scope.index].bespeakId;
            $scope.orderId = $scope.orderList[$scope.index].orderId;
            switch (param) {
                case 1:
                    $scope.status = '000002';
                    break;
                case 2:
                    $scope.status = '000005';
                    break;
            }
            $scope.changeOrderStatus($scope.orderId, $scope.status);

        }
    };
    //分配选择确定按钮
    $scope.AssignEnSure = function() {
        $scope.AssignData($scope.orderId, $scope.status, $scope.cUserId, $scope.userName);
    }
    $scope.allClick = function(e) {
            // console.log("index   "+e);
            $scope.index = e;
            $scope.tag.current = -1;
        }
        //订单详情
    $scope.orderDetail = function(e) {
            $scope.index = e;
            $scope.bespeakId = $scope.orderList[$scope.index].bespeakId;
            $scope.orderId = $scope.orderList[$scope.index].orderId;
            $state.go('unicom-order-detail', { orderId: $scope.orderId });
        }
        //状态选择
    $scope.stateChange = function(e) {
            $scope.index = e;

            $scope.bespeakId = $scope.orderList[$scope.index].bespeakId;
            $scope.orderId = $scope.orderList[$scope.index].orderId;
            $scope.userName = $scope.orderList[$scope.index].userName;
            if ($scope.orderList[$scope.index].status == '000003') {
                $scope.status = '000007';
                console.log('??????==' + $scope.status);
                alertChange("确定受理该订单？");
            } else if ($scope.orderList[$scope.index].status == '000007') {
                $scope.status = '000004';
                // alertChange("确定该订单装机成功？");
                $scope.alertLan();
            }
        }
        //取消订单
    $scope.assignChange = function(e) {
        $scope.index = e;
        $scope.status = '000006';
        $scope.bespeakId = $scope.orderList[$scope.index].bespeakId;
        $scope.orderId = $scope.orderList[$scope.index].orderId;
        // $scope.alertGiveUp();
        $state.go("unicom-order-cancle", { "orderId": $scope.orderId, "status": $scope.status, "userName": $scope.userName });
    }

    //关闭未分配
    $scope.closeAssignPop = function() {
            $scope.isNoShowAssignPop = false;
        }
        //查询
    $scope.queryClick = function() {
            $scope.isNoShowChosePop = !$scope.isNoShowChosePop;
            $scope.isNoShowStatePop = false;
            $scope.isNoShowAssignPop = false;
        }
        //关闭查询窗口
    $scope.closeChosePop = function() {
            $scope.isNoShowChosePop = false;
        }
        //渠道经理
    $scope.channelClick = function() {
            $scope.isNoShowChannelList = !$scope.isNoShowChannelList;
        }
        //状态
    $scope.stateClick = function(index) {
            $scope.isNoShowStateList = !$scope.isNoShowStateList;
        }
        //查询关键字
    $scope.lookKeywords = function(keyword) {
            // console.log(keyword);
            $scope.keywords = keyword;

        }
        //筛选中的日期
    $scope.setStartTime = function(e) {
        $scope.getStartTime = $filter('date')(e, 'yyyy-MM-dd');
        //console.log("?1 "+$scope.getStartTime);
    }
    $scope.setEndTime = function(e) {
            $scope.getEndTime = $filter('date')(e, 'yyyy-MM-dd');
            //console.log("?2 "+$scope.getEndTime);
        }
        //重置
    $scope.resetting = function() {
            $scope.tag2.current = -1;
            $scope.tag3.current = -1;
            $scope.getStartTime = GetDateStr(-30);
            $scope.getEndTime = GetDateStr(1);
        }
        //确定
    $scope.ensure = function() {
            $scope.isNoShowChosePop = false;
            $scope.pageIndex = 1;
            $scope.orderList = [];
            $scope.getDate($scope.userId, $scope.pageSize, $scope.pageIndex, $scope.getStartTime, $scope.getEndTime, $scope.keywords, $scope.status, $scope.cUserId);
        }
        //日期
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        var d = dd.getDate();
        return y + "-" + m + "-" + d;
    }
    //选择提示
    function alertChange(info) {
        var confirmPopup = $ionicPopup.confirm({
            title: '系统提示',
            template: info,
            scope: $scope,
            buttons: [
                { text: '取消' },
                {
                    text: "<b>确定</b>",
                    type: "button-positive",
                    onTap: function() {
                        $scope.changeOrderStatus($scope.orderId, $scope.status, $scope.userName);

                    }
                }
            ]
        });
    }
    //更改激活状态
    $scope.updataOrderState = function(orderId) {
        $http({
            method: 'get',
            url: ajaxurl + 'unicomMallLanApp/updateWkkdState?token=' + $rootScope.token,
            params: { orderId: orderId }
        }).success(function(data) {
            if (data.result == 'success') {
                if (data.status == null) {
                    $scope.status = '未处理';
                } else if (data.status == '00') {
                    $scope.status = '未处理';
                } else if (data.status == '01') {
                    $scope.status = '激活成功';
                } else if (data.status == '02') {
                    $scope.status = '退单';
                } else if (data.status == '03') {
                    $scope.status = '退款';
                }
                my.alert('王卡激活状态已更改为' + $scope.status).then(function() {
                    $scope.upData();
                });
            } else {
                my.alert('王卡激活状态未改变');
            }
        }).error(function() {
            my.alert('王卡激活状态更改失败,请稍后重试！');
        })
    }
});