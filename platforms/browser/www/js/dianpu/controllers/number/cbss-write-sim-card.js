appControllers.controller('dianpu-cbss-write-simCard', function($scope, $state, $ionicPopup, $http, my) {
    $scope.title = 'CBSS开卡';
    $scope.agree = true;
    $scope.remark = '用户开卡用户开卡用户开卡用户开卡用户开卡用户开卡用户开卡用户开卡用户开卡用户开卡用户开卡用户开卡';
    $scope.input = {
            "preCharge": $scope.preCharge,
            "remark": ''
        }
        //身份证信息
    $scope.identifyInfo = [];
    // 号码信息
    $scope.numberInfo = [];
    //价格数组
    $scope.priceList = [];
    //价格添加进价格明细数组
    $scope.priceList.push({
        "priceEntry": "号码预存话费",
        "price": $scope.preCharge
    });
    //读取身份证信息
    $scope.readIdentifyInfo = function() {
            $scope.showIdentifyInfo = true;
        }
        //选择号码
    $scope.selectNumber = function() {
            $scope.showNumberInfo = true;
        }
        //编辑预存
    $scope.editPrestored = function() {
            $ionicPopup.show({
                "template": '<input type="tel" autofocus ng-model="input.preCharge" placeholder="请输入预存金额">',
                "title": '输入预存金额',
                "scope": $scope,
                "buttons": [{
                        "text": '取消',
                        "onTap": function(e) {
                            $scope.input.preCharge = '';
                        }
                    },
                    {
                        "text": '<b>确认</b>',
                        "type": 'button-calm',
                        "onTap": function(e) {
                            $scope.preCharge = $scope.input.preCharge;
                        }
                    },
                ]
            });
        }
        //修改备注
    $scope.editRemark = function() {
            var temp = '<textarea class="bd pl-10" ng-model="input.remark" style="min-height:27vh;" placeholder="输入备注信息"></textarea>';
            $ionicPopup.show({
                template: temp,
                title: '更改备注',
                subTitle: '输入要更改的备注',
                scope: $scope,
                buttons: [{
                        text: '取消',
                        onTap: function() {
                            $scope.input.remark = '';
                        }
                    },
                    {
                        text: '<b>确定</b>',
                        type: 'button-calm',
                        onTap: function() {
                            $scope.remark = $scope.input.remark;
                        }
                    },
                ]
            });
        }
        //同意协议
    $scope.agreeClick = function() {
            $scope.agree = !$scope.agree;
        }
        //协议细则
    $scope.protocolDetails = function() {
        localStorage.setItem('userOrderNumber', $scope.simInput.number);
        localStorage.setItem('userOrderName', $scope.simInput.name);
        localStorage.setItem('userOrderCardId', $scope.simInput.cardId);
        $state.go("dianpu-cbss-protocol-details");
    }
})