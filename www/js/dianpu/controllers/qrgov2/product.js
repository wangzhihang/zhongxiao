appControllers.controller('dianpu-qrgoV2-package', function($scope, $state, $http, $stateParams, $rootScope, my, unicomm_server) {

	$scope.title = "产品列表";
	$scope.loading = true;

	order_info = {};
	authentication = {};
	number_pool = "QRGO2";
	qrgoInfo = {};
	app = "dianpu"
	order_type = "kaika"
	number_pool = "QRGO2"
	service_type = "qrgo2"
	source = "000028"; 
	sourceName = "2i产品"


	$scope.productList = [];
	$scope.qrgo_login = function(){
		unicomm_server.getUnicomm({
			"cmd":"qrgo2_login",
			"userName":qrgoInfo.userName,
			"password":qrgoInfo.password,
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					console.log(return_json)
					qrgoInfo.userInfo = return_json.data;
					qrgoInfo.eparchyName = return_json.data.eparchyName;
					qrgoInfo.provinceName = return_json.data.provinceName;
					$scope.getProductList();
					// $scope.wkCardList();
				}else{
					my.alert("登录失败，当前对接码上购版本V2,请设置码上购发展人,请确认码上购版本!").then(function(){
						$state.go("dianpu-qrgo-list")
					});
				}
			}
		)
	}

	$http({
		method : "GET",
		url : ajaxurl + "nowGoApp/getDefaultByShopId?token=" + $rootScope.token
	}).success(function(data){

		if(data.userInfo){
			if(data.userInfo.userName && data.userInfo.password){
				qrgoInfo.userName = data.userInfo.userName;
				qrgoInfo.password = data.userInfo.password;
				$scope.qrgo_login();
			}else{
				if($rootScope.isShowsetTab){
					my.alert("请联系您的上级代理商绑定码上购账号。").then(function(){
						$state.go("index")
					});
				}else{
					my.alert("请绑定您的码上购账号。").then(function(){
						$state.go("mSg-form")
					});
				}
			}
		}else{
			if($rootScope.isShowsetTab){
				my.alert("请联系您的上级代理商绑定码上购账号。").then(function(){
					$state.go("index")
				});
			}else{
				my.alert("请绑定您的码上购账号。").then(function(){
					$state.go("mSg-form")
				});
			}
		}
	}).error(function(){
		my.alert("获取码上购账号失败。").then(function(){
			$state.go("index")
		});
	});
	//王卡套餐
	$scope.wangCardList = function(){
		$scope.productList = [
			{"id":"1","cardname":"大王卡","describe":"19元/月。1GB国内流量，国内语音拨打0.1元/分钟。可办理3张副卡（6元/张）。", "productId":"841812049359","img":"img/package.png"},
			{"id":"2","cardname":"地王卡","describe":"39元/月。1GB国内流量，300分钟国内语音。可办理3张副卡（6元/张）。", "productId":"841812049361","img":"img/package.png"},
			{"id":"3","cardname":"天王卡","describe":"59元/月。1GB国内流量，800分钟国内语音。可办理3张副卡（6元/张）。","productId":"841812049360","img":"img/package.png"}
		]
	}
	//阿里宝卡套餐
	$scope.aliCardList = function(){
		unicomm_server.getUnicomm({
			"cmd":"qrgo2_getProductList",
			"productType":"Ali-card"
		}).then(
			function(return_json){
				if (return_json.status == '1') {
						$scope.productList.push({"id":"1","cardname":"阿里小宝卡", "describe":"19元/月。1GB国内流量，100分钟国内语音。","productId":"981711282733","img":"img/albk.png"})
						$scope.productList.push({"id":"2","cardname":"阿里大宝卡", "describe":"59元/月。2GB国内流量，500分钟国内语音。","productId": "981711282734","img":"img/albk.png"})
						$scope.AliShow = true;
						$scope.loading = false;
				}else{
					$scope.loading = false;
				}
			}
		)
	}
	// $scope.wkCardList = function(){
	// 	unicomm_server.getUnicomm({
	// 		"cmd":"qrgo2_getLocalProductList",
	// 		// "productType":"Ali-card"
	// 	}).then(
	// 		function(return_json){
	// 			if (return_json.status == '1') {
	// 			}else{
	// 				$scope.loading = false;
	// 			}
	// 		}
	// 	)
	// }
	//初始化数据
	$scope.getProductList = function(){
		if($stateParams.qrgoType == 1){
			$scope.wangCardList();
			$scope.loading = false;
		}else if($stateParams.qrgoType == 2){
			$scope.aliCardList();
		}else{
			$scope.wangCardList();
			$scope.aliCardList();
		}
		
	}


	$scope.getInitData = function(i)
	{
		$scope.loading=true;
		order_info = {
			"productId":$scope.productList[i].productId
			,"productName":$scope.productList[i].cardname
			,"productDescribe":$scope.productList[i].describe
			,"productImg":$scope.productList[i].img
			
		}
		$state.go('dianpu-qrgo-now-purchase');
	}
});