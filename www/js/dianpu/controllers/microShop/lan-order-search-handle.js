appControllers.controller('dianpu-microshop-lan-order-search-handle', function($scope, $state, $http, $ionicPopup, $rootScope, my, $filter) {

    $scope.title = "详情";
    $scope.preorderList = JSON.parse(localStorage.getItem("preorderList"));
    $scope.remarkList = [];
    if ($scope.preorderList.remark != null) {
        $scope.remarkList = $scope.preorderList.remark.split("|");
    }

    //办卡
    $scope.lanOrderPay = function() {

        empty_filterSelect();
        filterSelect = {};
        reset_kuandai_wojia();
        order_type = "kuandai";
        app = "kuandai";
        number_pool = "CBSS";
        wojiaIsronghe = false; // 判断是不是共享套餐
        wojiaRootProductId = "89706086";
        KuandaiMainProductName = "沃家组合";
        service_type = "wojia-combination";
        kuandai_number_into = true;
        reelectNumber = 0;

        kuandai_selected_package["tv_type"] = "data/tv-0";
        kuandai_selected_package.tv = true;

        wx_order["orderCode"] = $scope.preorderList.orderCode
        wx_order["tv"] = $scope.preorderList.box == "000001" ? true : false
        wx_order["ftth"] = $scope.preorderList.cat == "000001" ? true : false
        wx_order["preCharge"] = "0";
        wx_order['intoNumber'] = $scope.preorderList.contactNumber;
        wx_order["hmzj"] = $scope.preorderList.source == "000004"; // 是否号码之家工号

        kuandai_combination_address = str2json($scope.preorderList.projectAddress);
        kuandai_combination_address["detailed"] = str2json($scope.preorderList.detailAddress);
        kuandai_combination_address["detailed"]["pointExchId"] = kuandai_combination_address["detailed"]["pointExchId"] == "" ? kuandai_combination_address["detailed"]["exchCode"] : kuandai_combination_address["detailed"]["pointExchId"];

        $state.go("authentication-device");
    }

    //转派
    $scope.goRedeploy = function() {
        $state.go("dianpu-microshop-order-redeploy", { orderCode: $scope.preorderList.orderCode });
    }

    //添加备注
    $scope.addRemarkInfo = function(remark) {
        $http({
            method: 'GET',
            url: ajaxurl + 'lanPreorderApp/modifyLanCallNumber?token=' + $rootScope.token,
            params: {
                id: $scope.preorderList.callNumberId,
                status: "000007",
                remark: remark
            }
        }).success(function() {
            my.alert('添加成功！').then(function() {
                $state.go('dianpu-microshop-lan-order-search-hz');
            });
        }).error(function() {
            my.alert('数据信息获取失败！请稍后尝试。').then(function() {
                $state.go('orderManagements');
            });
        });
    }
    $scope.addRemark = function() {
        $scope.data = {};
        $ionicPopup.show({
            template: '<textarea rows="5" cols="10"  ng-model="data.remark" placeholder="请输入装维回执备注"></textarea>',
            title: '添加装维回执备注',
            scope: $scope,
            buttons: [
                { text: '取消' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.remark) {
                            e.preventDefault();
                        } else {
                            $scope.addRemarkInfo($scope.data.remark + '   ' + $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss'));
                        }
                    }
                },
            ]
        });
    }
})