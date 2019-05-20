appControllers.controller('orderManagements', function($scope,$state) {
	$scope.title = '订单列表';
    $scope.appFuncListShow=appFuncListShow;

    $scope.hmOrderList = function(pageTitle){
        $state.go('dianpu-hm-order-list', {pageTitle:'号码预存订单'});
    }
    $scope.lanOrderList = function(pageTitle){
        $state.go('dianpu-microshop-lan-order-list', {pageTitle:'宽带预存订单'});
    }
    $scope.otherAccept =function(){
        $state.go('dianpu-wx-other-accept', {pageTitle:'异业统计'});
    }

    $scope.marketOrderList =function(){
        $state.go('market-myord', {pageTitle:'我的订单'});
    }
})
