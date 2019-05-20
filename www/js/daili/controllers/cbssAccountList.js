appControllers.controller('cbss-account-list', function($scope, my, $http, $state, $ionicPopup, $rootScope) {
    $scope.title = 'CBSS工号列表';
    $scope.cbssInfoListLength = null;
    $scope.tag = null;
    //初始化信息列表
    getInfoList();
    //获取数据表
    function getInfoList() {
        $scope.loading = true;
        $scope.cbssInfoList = [];
        $http({
            method: 'get',
            url: ajaxurl + 'cbssInfoApp/queryAgencyCbssList?token=' + $rootScope.token
        }).success(function(data) {
            $scope.loading = false;
            $scope.cbssInfoList = data.cbssInfoList;
            $scope.cbssInfoListLength = $scope.cbssInfoList.length;
            // console.log(JSON.stringify($scope.cbssInfoList));
            if ($scope.tag == 1 && $scope.cbssInfoListLength == 1) {
                var myPopup = $ionicPopup.show({
                    title: '提示信息',
                    template: '<div class="txtCenter">剩余工号：' + data.cbssInfoList[0].userName + '<br/>设为默认吗？</div>',
                    buttons: [
                        { text: '取消' },
                        {
                            text: '<b>确定</b>',
                            type: 'button-positive',
                            onTap: function() {
                                $scope.cbssDefault(data.cbssInfoList[0].id);
                            }
                        },
                    ]
                })
            }
            for (var i = 0 in $scope.cbssInfoList) {
                if ($scope.cbssInfoList[i].ifTest == '000001') {
                    $scope.cbssInfoList[i].checked = true;
                } else {
                    $scope.cbssInfoList[i].checked = false;
                }
                if ($scope.cbssInfoList[i].bodyCertification == '0') {
                    $scope.cbssInfoList[i].liveBody = false;
                } else {
                    $scope.cbssInfoList[i].liveBody = true;
                }
                if ($scope.cbssInfoList[i].identityCard == '0') {
                    $scope.cbssInfoList[i].identify = false;
                } else {
                    $scope.cbssInfoList[i].identify = true;
                }
            }

        });
    }
    //修改密码
    $scope.changePwd = function(index) {
        localStorage.setItem('id', $scope.cbssInfoList[index].id);
        localStorage.setItem('userName', $scope.cbssInfoList[index].userName);
        localStorage.setItem('password', $scope.cbssInfoList[index].password);
        localStorage.setItem('developPhone', $scope.cbssInfoList[index].developPhone);
        localStorage.setItem('staffName', $scope.cbssInfoList[index].staffName);
        $state.go('change-cbss-pwd');
    };
    // 权限分配
    $scope.powerDivsion = function(index) {
        localStorage.setItem('id', $scope.cbssInfoList[index].id);
        my.alert('请在电脑端分配权限');
    };
    //设置CBSS默认工号
    $scope.cbssDefault = function(id) {
        $http({
            method: 'post',
            url: ajaxurl + 'cbssInfoApp/setAllDeptDefaultCbss?token=' + $rootScope.token,
            data: { id: id }
        }).success(function(data) {
            if (data == true) {
                my.alert('该工号已设置为默认CBSS工号。');
            }
        }).error(function() {
            my.alert('数据信息获取失败，请稍后尝试！');
        });
    }

    //删除账号提示框
    $scope.showPopu = function(index) {
        $scope.cbssId = $scope.cbssInfoList[index].id;
        var myPopup = $ionicPopup.show({
            title: '提示信息',
            template: '你确定要删除该账号？',
            buttons: [
                { text: '取消' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function() {
                        //console.log("确定删除");
                        $http({
                            method: 'post',
                            url: ajaxurl + 'cbssInfoApp/delCbssAccount?token=' + $rootScope.token,
                            data: { cbssId: $scope.cbssId }
                        }).success(function(data) {
                            $scope.tag = 1;
                            getInfoList();
                        })
                    }
                },
            ]
        });


    };

    //打开需要验证码开关
    $scope.setIfTestForCbss = function(id, isTest) {
        $http({
            method: 'post',
            url: ajaxurl + 'cbssInfoApp/setIfTestForCbss?token=' + $rootScope.token,
            data: {
                'id': id,
                'ifTest': isTest
            }
        }).success(function(data) {

        });
    }
    $scope.needVertifyCode = function(id, index) {
            // console.log('id=='+id+'     '+$scope.cbssInfoList[index].checked);

            if ($scope.cbssInfoList[index].checked == true) {
                $scope.setIfTestForCbss(id, '000001');
            } else {
                $scope.setIfTestForCbss(id, '000002');
            }

        }
        //打开活体
    $scope.needliveBody = function(id, bodyCertification) {
            if (bodyCertification == '0') {
                $http({
                    method: 'post',
                    url: ajaxurl + 'cbssInfoApp/updateBodyCertification?token=' + $rootScope.token,
                    data: {
                        'id': id,
                        'bodyCertification': '1'
                    }
                }).success(function(data) {

                });
            } else if (bodyCertification == '1') {
                $http({
                    method: 'post',
                    url: ajaxurl + 'cbssInfoApp/updateBodyCertification?token=' + $rootScope.token,
                    data: {
                        'id': id,
                        'bodyCertification': '0'
                    }
                }).success(function(data) {

                });
            }
        }
        //打开身份证正反面
    $scope.needIdentify = function(id, identityCard) {
        if (identityCard == '0') {
            $http({
                method: 'post',
                url: ajaxurl + 'cbssInfoApp/updateIdentityCardForCbss?token=' + $rootScope.token,
                data: {
                    'id': id,
                    'identityCard': '1'
                }
            }).success(function(data) {

            });
        } else if (identityCard == '1') {
            $http({
                method: 'post',
                url: ajaxurl + 'cbssInfoApp/updateIdentityCardForCbss?token=' + $rootScope.token,
                data: {
                    'id': id,
                    'identityCard': '0'
                }
            }).success(function(data) {

            });
        }
    }


});