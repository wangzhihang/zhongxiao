appControllers.controller('visit-resure-My-Orders', function($scope, $rootScope, $http, $state, my, $ionicPopup) {
    $scope.title = '订单分配平台';
    $scope.resState = false;
    $scope.btnText = '确认';
    $scope.hienConfirmBtn = false;
    $scope.planReveiveOrders = JSON.parse(localStorage.getItem('planReveiveOrders'));
    $scope.rejectOrders = JSON.parse(localStorage.getItem('rejectOrders'));
    $scope.myPosition = JSON.parse(localStorage.getItem('myPosition'));
    $scope.input = {
        proDescripte: ''
    };
    $scope.deleteOrders = [];
    $scope.receiveOrders = [];
    $scope.deleteOrdersId = [];
    $scope.receiveOrdersId = [];
    $scope.tag = null;

    $scope.seriousProblem = [
        { 'type': '000001', 'reason': '电话有误', 'choseType': false },
        { 'type': '000001', 'reason': '订单取消', 'choseType': false },
        { 'type': '000001', 'reason': '地址模糊', 'choseType': false }
    ];
    $scope.commonProblem = [
        { 'type': '000002', 'reason': '距离太远', 'choseType': false },
        { 'type': '000002', 'reason': '时间冲突', 'choseType': false },
        { 'type': '000002', 'reason': '实地地方', 'choseType': false }
    ];

    //改变单条订单
    $scope.changeSigleList = function(id, remark, yyTime, status) {
        $http({
            method: 'POST',
            url: ajaxurl + "wangka/updateById?token=" + $rootScope.token,
            data: {
                'id': id,
                'remark': remark,
                'yyTime0': yyTime,
                'status': status

            }
        }).success(function(data) {
            if ($scope.showReSureOpenCardInfo == true) {
                $scope.showReSureOpenCardInfo = false;
            }
            if (data == true && $scope.tag == 1) {
                my.alert('预约时间更改成功');
            } else {
                my.alert('删除成功');
                $scope.deleteOrders.type = '000010';
                $scope.rejectOrders.push($scope.deleteOrders);
                localStorage.setItem('rejectOrders', JSON.stringify($scope.rejectOrders));
            }

        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。').then(function() {
                // $state.go('index');
            });
        });
    }

    //改变预约时间
    $scope.changeDealOrderTime = function(index) {
        $scope.tag = '1';
        $scope.changeSigleList($scope.planReveiveOrders[index].id, null, $scope.planReveiveOrders[index].createTime);
    }

    //删除订单
    $scope.deleteList = function(index) {
        var myPopup = $ionicPopup.show({
            title: '提示信息',
            template: '确定删除该条订单并填写原因？',
            buttons: [
                { text: '取消' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function() {
                        // $scope.planReveiveOrders[index].type='000010';
                        $scope.showReSureOpenCardInfo = true;
                        $scope.deleteOrders = $scope.planReveiveOrders[index];
                    }
                },
            ]
        });
    }

    //选择严重类型删除原因
    $scope.choseSeriousProblem = function(index) {
        if ($scope.seriousProblem[index].choseMoreType == false) {
            $scope.seriousProblem[index].choseMoreType = true;
        } else {
            $scope.seriousProblem[index].choseMoreType = false;
        }
    }

    //选择普通类型删除原因
    $scope.choseCommonProblem = function(index) {
        if ($scope.commonProblem[index].choseType == false) {
            $scope.commonProblem[index].choseType = true;
        } else {
            $scope.commonProblem[index].choseType = false;
        }
    }

    //关闭删除层
    $scope.closeReSureOpenCardInfo = function() {
        $scope.showReSureOpenCardInfo = false;
    }

    //确认订单跳转规划路线
    $scope.planRoute = function() {
            $scope.resState = true;
            $scope.btnText = '正在提交';
            for (var i = 0 in $scope.rejectOrders) {
                $scope.deleteOrdersId.push($scope.rejectOrders[i].id);
            }
            for (var i = 0 in $scope.planReveiveOrders) {
                if ($scope.planReveiveOrders[i].type != '000010') {
                    $scope.receiveOrders.push($scope.planReveiveOrders[i]);
                    $scope.receiveOrdersId.push($scope.planReveiveOrders[i].id);
                }
            }

            $http({
                method: 'POST',
                url: ajaxurl + "wangka/chooseAcceptAndRefuse?token=" + $rootScope.token,
                data: {
                    'acceptIds': $scope.receiveOrdersId,
                    'refuseIds': $scope.deleteOrdersId,
                    'jingdu': $scope.myPosition.longitude,
                    'weidu': $scope.myPosition.latitude,
                    'province': $scope.myPosition.province,
                    'city': $scope.myPosition.city,
                    'area': $scope.myPosition.area
                }
            }).success(function(data) {
                localStorage.setItem('planReveiveOrders', JSON.stringify(data));
                $state.go('visit-plan-travel-route');
            }).error(function() {
                my.alert('数据信息获取失败！请稍后尝试。').then(function() {
                    // $state.go('index');
                });
            });

        }
        //提交原因按钮
    $scope.confirmReason = function() {
        $scope.reasonMoreList = '';
        $scope.reasonList = '';
        for (var i = 0 in $scope.seriousProblem) {
            if ($scope.seriousProblem[i].choseMoreType == true) {
                $scope.reasonMoreList += $scope.seriousProblem[i].reason + ',';
            }
        }
        for (var i = 0 in $scope.commonProblem) {
            if ($scope.commonProblem[i].choseType == true) {
                $scope.reasonList += $scope.commonProblem[i].reason + ',';
            }
        }
        // console.log('111'+JSON.stringify($scope.reasonList)+'     '+$scope.reasonList.length);
        if ($scope.reasonMoreList.length == 0 && $scope.reasonList.length == 0 && $scope.input.proDescripte == '') {
            my.alert('请选择或填写删除该订单的原因');
        } else if ($scope.reasonMoreList.length > 0 && $scope.reasonList.length > 0) {
            my.alert('如果您选择严重原因，不能再去选择普通原因');
        } else if ($scope.reasonMoreList.length > 0 && $scope.reasonList.length == 0 && $scope.input.proDescripte == '') {
            $scope.changeSigleList($scope.deleteOrders.id, $scope.reasonMoreList, null, '000006');
        } else if ($scope.reasonMoreList.length == 0 && $scope.reasonList.length > 0 && $scope.input.proDescripte == '') {
            $scope.changeSigleList($scope.deleteOrders.id, $scope.reasonList, null, null);
        } else if ($scope.reasonMoreList.length == 0 && $scope.reasonList.length == 0 && $scope.input.proDescripte != '') {
            $scope.changeSigleList($scope.deleteOrders.id, $scope.input.proDescripte, null, null);
        } else if ($scope.reasonMoreList.length == 0 && $scope.reasonList.length > 0 && $scope.input.proDescripte != '') {
            $scope.reasonList += $scope.input.proDescripte;
            $scope.changeSigleList($scope.deleteOrders.id, $scope.reasonList, null, null);
        }

    }


})