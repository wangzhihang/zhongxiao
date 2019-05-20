appControllers.controller('ok', function($scope, $ionicPopup, $rootScope, $state, $http, my) {

	$scope.data = {};

	// 订单金额
	$scope.showOrderFee = false;
	if(order_amount != null){
		$scope.showOrderFee = true;
		$scope.orderFee = order_amount;
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

	
	angular.element("#qrbox2pay").qrcode({ 
		"render": "canvas"
		, "width": 240
		, "height":240
		, "text": "wxp://f2f0IL5zNjpvlsDvCDYpXyFuTSmklwhDBtVb"
	}); 
	$scope.payQr = userBo.userName == "c88" ? true : false;


	// $scope.viewElectronicWorksheets = function(){
	// 	handleDocumentWithURL(
	// 		function() {
	// 		},
	// 		function(error) {
	// 			if(error == 53) {
	// 				$ionicPopup.alert({
	// 				   title: '系统提示',
	// 				   template: '对不起，您的手机无法阅读PDF文件！',
	// 				   okText:'我知道了',
	// 				   okType:'button-default'
	// 				});
	// 			}
	// 		},				
	// 		$scope.eleOrder
	// 	);
	// }


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