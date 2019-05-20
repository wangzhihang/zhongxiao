appControllers.controller('kuandai-handle-kuandai', function($scope, $state, $ionicPopup, $http, my) {
    $scope.title = '宽带';
    $scope.showSedKuandaiInfo = false;
    $scope.sedRemark = '用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐';
    $scope.firstRemark = '用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐用户办理宽带套餐';
    $scope.input = {
            "preCharge": $scope.preCharge,
            "firstMaterialFee": $scope.firstMaterialFee,
            "sedMaterialFee": $scope.sedMaterialFee,
            "firstKuandaiFee": $scope.firstKuandaiFee,
            "sedKuandaiFee": $scope.sedKuandaiFee,
            "firstRemark": '',
            "sedRemark": ''
        }
        //身份证信息
    $scope.identifyInfo = [];
    // 号码信息
    $scope.numberInfo = [];
    //第一条宽带信息
    $scope.firstKuandaiInfo = [];
    // 第二条宽带信息
    $scope.sedKuandaiInfo = [];
    //价格数组
    $scope.priceList = [];
    //价格添加进价格明细数组
    $scope.priceList.push({
        "priceEntry": "号码预存话费",
        "price": $scope.preCharge
    });
    $scope.priceList.push({
        "priceEntry": "第一条宽带工料费",
        "price": 100
    });
    //读取身份证信息
    $scope.readIdentifyInfo = function() {
            $scope.showIdentifyInfo = true;
        }
        //选择号码
    $scope.selectNumber = function() {
            $scope.showNumberInfo = true;
        }
        //办理第一条宽带
    $scope.handleFirstKuandai = function() {
            // if ($scope.identifyInfo.length == 0) {
            //     my.alert('请先读取身份证信息');
            //     return;
            // } else if ($scope.numberInfo.length == 0) {
            //     my.alert('请先选择号码');
            //     return;
            // } else {
            //     $scope.showFirstKuandaiInfo = true;
            //     $scope.showSedKuandaiInfo = true;
            // }
            $scope.showFirstKuandaiInfo = true;
            $scope.showSedKuandaiInfo = true;
        }
        //办理第二条宽带
    $scope.handleSedKuandai = function() {
            $scope.showSedKuandaiDetail = true;
            $scope.showSedKuandaiInfo = false;
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
        //更改第一条宽带预存
    $scope.editFirstKuandaiFee = function() {
            $ionicPopup.show({
                "template": '<input type="tel" autofocus ng-model="input.firstKuandaiFee" placeholder="请修改第一条宽带预存费用">',
                "title": '输入宽带预存',
                "scope": $scope,
                "buttons": [{
                        "text": '取消',
                        "onTap": function(e) {
                            $scope.input.firstKuandaiFee = '';
                        }
                    },
                    {
                        "text": '<b>确认</b>',
                        "type": 'button-calm',
                        "onTap": function(e) {
                            $scope.firstKuandaiFee = $scope.input.firstKuandaiFee;
                        }
                    },
                ]
            });
        }
        //更改第一条宽带工料费
    $scope.editFirstMaterialFee = function() {
            $ionicPopup.show({
                "template": '<input type="tel" autofocus ng-model="input.firstMaterialFee" placeholder="请修改第一条宽带工料费">',
                "title": '输入工料费',
                "scope": $scope,
                "buttons": [{
                        "text": '取消',
                        "onTap": function(e) {
                            $scope.input.firstMaterialFee = '';
                        }
                    },
                    {
                        "text": '<b>确认</b>',
                        "type": 'button-calm',
                        "onTap": function(e) {
                            $scope.firstMaterialFee = $scope.input.firstMaterialFee;
                        }
                    },
                ]
            });
        }
        //修改第一条宽带备注
    $scope.editFirstRemark = function() {
            var temp = '<textarea class="bd pl-10" ng-model="input.firstRemark" style="min-height:27vh;" placeholder="输入备注信息"></textarea>';
            $ionicPopup.show({
                template: temp,
                title: '更改备注',
                subTitle: '输入要更改的备注',
                scope: $scope,
                buttons: [{
                        text: '取消',
                        onTap: function() {
                            $scope.input.firstRemark = '';
                        }
                    },
                    {
                        text: '<b>确定</b>',
                        type: 'button-calm',
                        onTap: function() {
                            $scope.firstRemark = $scope.input.firstRemark;
                        }
                    },
                ]
            });
        }
        //更改第二条宽带预存
    $scope.editSedKuandaiFee = function() {
            $ionicPopup.show({
                "template": '<input type="tel" autofocus ng-model="input.sedKuandaiFee" placeholder="请修改第二条宽带预存费用">',
                "title": '输入宽带预存',
                "scope": $scope,
                "buttons": [{
                        "text": '取消',
                        "onTap": function(e) {
                            $scope.input.sedKuandaiFee = '';
                        }
                    },
                    {
                        "text": '<b>确认</b>',
                        "type": 'button-calm',
                        "onTap": function(e) {
                            $scope.sedKuandaiFee = $scope.input.sedKuandaiFee;
                        }
                    },
                ]
            });
        }
        //更改第二条宽带工料费
    $scope.editSedMaterialFee = function() {
            $ionicPopup.show({
                "template": '<input type="tel" autofocus ng-model="input.sedMaterialFee" placeholder="请修改第二条宽带工料费">',
                "title": '输入工料费',
                "scope": $scope,
                "buttons": [{
                        "text": '取消',
                        "onTap": function(e) {
                            $scope.input.sedMaterialFee = '';
                        }
                    },
                    {
                        "text": '<b>确认</b>',
                        "type": 'button-calm',
                        "onTap": function(e) {
                            $scope.sedMaterialFee = $scope.input.sedMaterialFee;
                        }
                    },
                ]
            });
        }
        //修改第二条宽带备注
    $scope.editSedRemark = function() {
            var temp = '<textarea class="bd pl-10" ng-model="input.sedRemark" style="min-height:27vh;" placeholder="输入备注信息"></textarea>';
            $ionicPopup.show({
                template: temp,
                title: '更改备注',
                subTitle: '输入要更改的备注',
                scope: $scope,
                buttons: [{
                        text: '取消',
                        onTap: function() {
                            $scope.input.sedRemark = '';
                        }
                    },
                    {
                        text: '<b>确定</b>',
                        type: 'button-calm',
                        onTap: function() {
                            $scope.sedRemark = $scope.input.sedRemark;
                        }
                    },
                ]
            });
        }
        //显示价钱明细
    $scope.AllpriceDetial = function() {
            $scope.showPriceDetial = true;
            $scope.pushTag = true;
        }
        //关闭价钱明细
    $scope.closepriceDetial = function() {
        $scope.showPriceDetial = false;
        $scope.pushTag = false;
    }
})