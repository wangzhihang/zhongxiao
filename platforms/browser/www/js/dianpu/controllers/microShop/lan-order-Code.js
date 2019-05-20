appControllers.controller('dianpu-microshop-lan-order-Code', function($scope, $state, $rootScope, $http, $stateParams, my) {
    $scope.title = '宽带收费二维码';

    $http({
        method: 'post',
        url: ajaxurl + "pay/ChargePrecommit?token=" + $rootScope.token,
        data: {
            orderCode: $stateParams.orderCode,
            amount: $stateParams.payNumber,
            userId: userBo.userId
        },
        timeout: 5000
    }).success(function(data) {
        angular.element("#qrbox").qrcode({
            "render": "canvas",
            "width": 240,
            "height": 240,
            "text": data.codeUrl
        });
    }).error(function() {
        my.alert('数据信息获取失败！请稍后尝试。').then(function() { $state.go('dianpu-microshop-lan-order-search'); });
    });


    $scope.updateStatus = function() {
        $http({
            url: ajaxurl + "lanPreorderApp/updateStatusByPreorderNo",
            method: "GET",
            params: {
                token: $rootScope.token,
                preOrderNo: $stateParams.orderCode,
                status: "000101",
                projectAddressCode: ''
            }
        }).success(function(data) {
            // my.alert('支付成功！').then(function(){
            // 	$state.go('index');
            // });
            my.confirm("是否查看收费明细", "已支付成功！", "确认查看", "暂时不看").then(function() {
                $state.go('dianpu-microshop-lan-order-pay-detail', { orderCode: $stateParams.orderCode });
            }, function() {
                $state.go("index_dl");
            })
        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。');
        });
    }


    $scope.sendMsg = function() {
        $http({
            url: ajaxurl + "weChatForapp/querySendNumber?token=" + $rootScope.token,
            // url : "http://192.168.31.93:8080/tms-app-war/weChatForapp/querySendNumber",
            method: "get",
            params: {
                orderCode: $stateParams.orderCode
            }
        }).success(function(data) {
            $scope.contractNumber = data.data.userBo.contractNumber;
            $scope.realName = data.data.userBo.realName;
            $scope.senMsgToUser($scope.contractNumber, $scope.realName);
        })
    }

    // 发送短信
    $scope.senMsgToUser = function(contractNumber, realName) {
        $http({
            url: ajaxurl + "weChatForapp/sendMsg?token=" + $rootScope.token,
            // url : "http://192.168.31.93:8080/tms-app-war/weChatForapp/sendMsg?token=" + $rootScope.token,
            method: "post",
            data: {
                sendNumber: $scope.contractNumber,
                smsg: "你好," + $scope.realName + ":预订单号为" + $stateParams.orderCode + "的订单状态已经更新为支付完成，请及时去中台查看!"
            }
        })
    }

    //获取支付信息
    $scope.payResultUpdate = function() {
        $http({
            method: 'get',
            // url: ajaxurl + "recharge/queryRecordByRechargeNo",
            url: ajaxurl + "pay/payResultUpdate?token=" + $rootScope.token,
            params: {
                orderCode: $stateParams.orderCode,
                userId: userBo.userId,
                cardPrice: $stateParams.payNumber
            }
        }).success(function(data) {

        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。')
        });
    }

    //根据订单号查询代理商，业务员，店铺
    $scope.queryAgencyAndDeveAndShop = function() {
        $http({
            method: 'get',
            url: ajaxurl + "weChatForapp/queryAgencyAndDeveAndShopByDeptCode?token=" + $rootScope.token,
            params: {
                orderNo: $stateParams.orderCode
            }
        }).success(function(data) {
            if (data.data.shopBo) {
                $scope.sendKDorderToJPush(data.data.shopBo.userId);
                $scope.senMsgToUser(data.data.shopBo.contractNumber, data.data.shopBo.realName);
            }
            if (data.data.deveBo) {
                $scope.sendKDorderToJPush(data.data.deveBo.userId);
                $scope.senMsgToUser(data.data.deveBo.contractNumber, data.data.deveBo.realName);
            }
            if (data.data.agencyBo) {
                $scope.sendKDorderToJPush(data.data.agencyBo.userId);
                $scope.senMsgToUser(data.data.agencyBo.contractNumber, data.data.agencyBo.realName);
                // $scope.sendKDorderToJPush(40753);
                // $scope.senMsgToUser('18829716309',data.data.agencyBo.realName);
            }

        }).error(function() {

        });
    }

    //推送消息
    $scope.sendKDorderToJPush = function(userId) {
        $http({
            method: 'post',
            url: ajaxurl + "weChatForapp/sendKDorderToJPush?token=" + $rootScope.token,
            data: {
                userId: userId,
                message: '您有新的订单啦！',
                orderCode: $stateParams.orderCode
            }
        }).success(function(data) {

        }).error(function() {

        });
    }

    //点击支付成功按钮
    $scope.paySuccess = function() {
        $http({
            method: 'get',
            // url: ajaxurl + "recharge/queryRecordByRechargeNo",
            url: ajaxurl + "pay/queryRecordByRechargeNo",
            params: {
                token: $rootScope.token,
                rechargeNo: $stateParams.orderCode
            }
        }).success(function(data) {
            if (data == true) {
                $scope.sendMsg();
                $scope.updateStatus();
                $scope.payResultUpdate();
                $scope.queryAgencyAndDeveAndShop();
            } else {
                my.alert('支付未成功！');
            }
        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。')
        });
    }

});