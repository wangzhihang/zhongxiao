appControllers.controller('okk', function($scope,$ionicPopup, $state, $http, $rootScope, my) {
	$scope.data = {};


	// 订单金额
	$scope.showOrderFee = false;
	if(dianpu_order_amount != null){
		$scope.showOrderFee = true;
		$scope.orderFee = dianpu_order_amount;
	}


	// 工单
	$scope.inputEmail = function(){
		$ionicPopup.show({
			"template": '<input type="email" ng-model="data.email" placeholder="请输入电子邮箱地址...">',
			"title": '输入电子邮箱地址',
			"scope": $scope,
			"buttons":[
				{"text":'取消'},
				{
					"text": '<b>确认</b>',
					"type": 'button-calm',
					"onTap": function(e) {
						if (!$scope.data.email) {
							e.preventDefault();
						} else {
							$scope.sendEmail();
						}
					}
				},
			]
		});
	}

	$scope.sendEmail = function(){
		$http({
			method: 'GET',
			url: 'http://z.haoma.cn/tms-app-war/orderApp/sendEmail?token='+$rootScope.token,
			params: {"orderNo":authentication["orderNo"], "emailToAccount":$scope.data.email}
		}).success(function(data){
			my.alert("电子工单发送成功").then(function(){
				$state.go("index")
			})
		}).error(function(data){
		});
	}

});