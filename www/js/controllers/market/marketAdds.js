appControllers.controller('market-adds', function($scope, $http, $rootScope, $state, $stateParams, my, $ionicPopup) {
    $scope.title = '地址管理';
    $scope.loading = true;

    $scope.ww = true;
    $scope.id = '';
    $scope.receiveId = '';
    $scope.cityList = [];
    $scope.productList = [];
    $scope.receivePhone = $scope.productList.receivePhone;
    $scope.newReceiveId = '';
    $scope.oldReceiveId = '';
    $scope.receiveId = '';
    $scope.status = '';
    $scope.tag = {
        current: "-1"
    };
    //系统提示框
    $scope.showConfirm = function(info) {
        var confirmPopup = $ionicPopup.confirm({
            title: '系统提示',
            template: info,
            buttons: [
                { text: '取消' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function() {
                        $scope.getData();
                    }
                },
            ]
        });
    };
    //	收货地址列表
    $scope.getData = function() {
        $http({
            method: 'GET',
            url: ajaxurl + 'ehUser/receiveList?token=' + $rootScope.token,
            params: {}
        }).success(function(data) {
            $scope.loading = false;
            $scope.receiveList = data.receiveList;
            for (var i in $scope.receiveList) {
                if ($scope.receiveList[i].status == 000001) {
                    $scope.oldReceiveId = $scope.receiveList[i].id;
                    $scope.tag.current = $scope.receiveList[i].id;
                }
            }
            if ($scope.receiveList == null) {
                $scope.showAddTip = true;
            }
        }).error(function() {
            my.alert("遇到问题，请重试56575676");
        });
    }

    $scope.getData();





    //设置默认收货地址
    $scope.addDefault = function(e) {
        $scope.newReceiveId = $scope.receiveList[e].id;
        $http({
            method: 'GET',
            url: ajaxurl + 'ehUser/setDefaultReceive?token=' + $rootScope.token,
            params: {
                newReceiveId: $scope.newReceiveId
                    // oldReceiveId:$scope.oldReceiveId
            }
        }).success(function(data) {
            my.alert("已成功设置为默认地址！");
        }).error(function() {
            my.alert("遇到问题，请重试！");
        });
    }



    $scope.actions = {
        setCurrent: function(param, e) {
            $scope.tag.current = param;
            $scope.addDefault(e);
        }
    }

    //	//删除收货地址
    $scope.addDel = function(e) {
        my.confirm("您确定要删除此收货地址？", "", "", "").then(function() {
            $scope.receiveId = $scope.receiveList[e].id;
            $http({
                method: 'GET',
                url: ajaxurl + 'ehUser/delReceive?token=' + $rootScope.token,
                params: {
                    receiveId: $scope.receiveId,
                }
            }).success(function(data) {
                $scope.getData();
            }).error(function() {
                my.alert("遇到问题，请重试3435");
            });
            $scope.getData();
        })
    }

    //	//编辑地址
    $scope.addEdit = function(e) {
        $scope.oldAddress = {
            id: $scope.receiveList[e].id,
            province: $scope.receiveList[e].province,
            city: $scope.receiveList[e].city,
            area: $scope.receiveList[e].area,
            receiveName: $scope.receiveList[e].receiveName,
            receivePhone: $scope.receiveList[e].receivePhone,
            receiveAddress: $scope.receiveList[e].receiveAddress
        }
        localStorage.setItem('oldAddress', JSON.stringify($scope.oldAddress));
        $state.go("market-addnewadds");
    }
});