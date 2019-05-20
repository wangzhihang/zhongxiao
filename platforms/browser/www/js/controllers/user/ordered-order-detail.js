appControllers.controller('orderedOrderDetail', function($scope, $rootScope, $http, $ionicPopup) {
	$scope.title = '预约订单详情';
	$http({
		method: 'GET',
		url: ajaxurl + "numberOrderApp/toPreorderDetailByOrderCode?token=" + $rootScope.token,
		params: {"orderCode":order["orderCode"]}
	}).success(function(data){
		//console.log(JSON.stringify(data));
		$scope.orderCode = data.orderInfo['orderCode'];
		$scope.number = data.orderInfo['number'];
		$scope.productName = data.orderInfo['productName'];
		$scope.customer = data.orderInfo['customer'];
		$scope.contactNumber = data.orderInfo['contactNumber'];
		$scope.amount = data.orderInfo['amount'];
		$scope.createTime = data.orderInfo['createTime'];
		$scope.contactAddress = data.orderInfo['contactAddress'];
		$scope.remark = data.orderInfo['remark'];
	}).error(function () {
		$ionicPopup.alert({
		    title: '系统提示',
		    template: '获取订单详情失败!',
		    okText:'我知道了',
		    okType:'button-default'
		});
	});
});
