appControllers.controller('shop-inspection-info', function($scope,$http,$rootScope,$state,$ionicLoading,my) {
	$scope.title = '巡店详情';
	//console.log(localStorage.getItem('shopInspectionId'));
	// $ionicLoading.show({template: '数据加载中...'});
	$scope.loading=false;
	$http({
		method:'get',
		url:ajaxurl + 'shopVisit/queryShopVisit?token=' + $rootScope.token,
		params:{id:localStorage.getItem('shopInspectionId')},
		timeout: 10000
	}).success(function(data){
		// $ionicLoading.hide();
		$scope.loading=true;
		//console.log(JSON.stringify(data));
		$scope.visit=data.visit;
		//console.log($scope.visit);

	})
})
