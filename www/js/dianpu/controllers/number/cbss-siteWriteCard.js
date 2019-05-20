appControllers.controller('dianpu-cbss-site-writeCard', function($state, $scope, $http, $rootScope, my) {

	$scope.title = "现场写卡";

	$scope.levelCode=deptInfo.levelCode;

	$scope.loading = false;
	$scope.orderList = [];
	$http({
		method:'GET',
		url:ajaxurl + 'numberOrderApp/queryAppNumberOrderList?token=' + $rootScope.token,
		params:{
			statusArray:['000009','000016'],
			levelCode:$scope.levelCode,
			endTime:GetDateStr(1),
			startTime:GetDateStr(0)
		},
		timeout: 10000
	}).success(function(data){
		$scope.loading = true;
		$scope.orderList = data['orderList'];
	}).error(function () {
		my.alert('数据信息获取失败！请稍后尝试。');
	});

	$scope.order = function(index){
		reset_dianpu_cbss();
		order_type = "kaika";
		app = "dianpu";
		service_type = "telSelectCBSS";
		number_pool = "CBSS";
		source = "000004";
		sourceName = "CBSS选号";

		orderContinue = {
			"orderCode":$scope.orderList[index].orderCode,
			"status":$scope.orderList[index].status,
		}
		$http({
			method:'GET',
			url:ajaxurl + 'orderApp/queryUnicommOrderByOrderNo',
			params:{
				"orderNo":orderContinue.orderCode,
				"token":$rootScope.token
			}
		}).success(function(data){
			if(data.result == "ok"){
				orderContinue.unicommJson = str2json(data.order.unicommJson);
				$state.go("dianpu-cbss-write-sim-submit");
			}else{
				my.alert('无法获取订单信息。');
			}
		}).error(function () {
			my.alert('数据信息获取失败！请稍后尝试。');
		});

	}

})