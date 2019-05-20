appControllers.controller('user-breathe-SIM-submit', function($scope, $http, $state, my, $rootScope, $cordovaBarcodeScanner, $stateParams) {
    $scope.title = '外呼SIM卡信息提交';
    $scope.data = {
        'sim': '',
        'mainNumber': '',
        'minorNumber': ''
    };
    $scope.showSimInfo = false;
    if ($stateParams.iccid) {
        $scope.data.sim = $stateParams.iccid;
    }
    //扫码
    $scope.clientQr = function() {
        $cordovaBarcodeScanner
            .scan()
            .then(function(barcodeData) {
                if (barcodeData.text) {
                    $scope.scanCards = $scope.scanCards.concat(barcodeData.text);
                    for (var i = 0; i < $scope.scanCards.length; i++) {
                        if ($scope.scanCardsTotle.indexOf($scope.scanCards[i]) == -1) {
                            $scope.scanCardsTotle.push($scope.scanCards[i]);
                        }
                    }
                    console.log('scanCardsTotle' + $scope.scanCardsTotle);

                    // barcodeData.text=[89860115888402280164,89860115888402280164];
                } else {
                    my.alert("没有找到可识别的二维码！");
                }
            });
    }

    //搜索sim
    $scope.searchSim = function() {
            if ($scope.data.sim.length == 3 || $scope.data.sim.length == 7) {
                $http({
                    method: 'get',
                    url: ajaxurl + 'card/queryBlankCardListByICCIDStr?token=' + $rootScope.token,
                    params: { 'ICCIDStr': $scope.data.sim }
                }).success(function(data) {
                    $scope.simCardList = data;
                    $scope.showSimInfo = true;
                }).error(function() {
                    my.alert('数据信息获取失败！请稍后尝试。');
                });
            }
        }
        //选择卡号
    $scope.choseSim = function(item) {
            $scope.data.sim = item;
            $scope.showSimInfo = false;
        }
        //提交开卡信息
    $scope.submit = function() {
        if ($scope.data.sim == '') {
            my.alert('SIM卡号不能为空');
            return;
        } else if ($scope.data.sim.length != 19) {
            my.alert('请输入正确的SIM卡号');
            return;
        } else if ($scope.data.mainNumber == '') {
            my.alert('主卡号码不能为空');
            return;
        } else if ($scope.data.mainNumber.length != 11) {
            my.alert('请输入正确的主卡号码');
            return;
        } else {
            $http({
                method: 'post',
                url: ajaxurl + 'card/forceBlankCardToSuccess?token=' + $rootScope.token,
                data: {
                    'ICCID': $scope.data.sim,
                    'masterNumber': $scope.data.mainNumber
                }
            }).success(function(data) {
                if (data == true) {
                    my.alert('您已开卡成功');
                } else {
                    my.alert('开卡失败，请稍后重试。');
                }
            }).error(function() {
                my.alert('数据信息获取失败！请稍后尝试。');
            });
        }
    }


})