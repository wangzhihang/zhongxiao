appControllers.controller('app-ranking', function($scope, $http, $stateParams, $state, $rootScope, $ionicPopup,$ionicLoading, my, unicomm_server) {
	$scope.title = "排行榜";
	$scope.loading = true;
	$scope.shopTop = [];
	$scope.Tab = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.Tab.current = param;
		}
	};
	//获取当日店铺前20数据信息
	$http({
		method:'get',
		url:ajaxurl + 'appstats/queryShopOrderRankToday?token=' + $rootScope.token,
	}).success(function(data){
		$scope.loading = false;
		$scope.shopTopDay = data['orderDetail'];
	}).error(function () {
		my.alert("用户信息获取服务器连接失败,请稍后再试!");
	});
	//获取当月店铺前100数据信息
	$http({
		method:'get',
		url:ajaxurl + 'appstats/queryShopOrderRankThisMonth?token=' + $rootScope.token,
	}).success(function(data){
		$scope.loading = false;
		$scope.shopTopMonth = data['orderDetail'];
	}).error(function () {
		my.alert("用户信息获取服务器连接失败,请稍后再试!");
	});
})
