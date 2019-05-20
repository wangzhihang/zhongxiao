appControllers.controller('dianpu-cbss-phoneGiveFee', function($scope, $state, $cordovaBarcodeScanner, my) {

	dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"] = "";

	$scope.title = "购机赠费手机IMEI";
	$scope.input = {"imei":""};

	$scope.qrImei = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					$scope.input.imei = barcodeData.text;
				}else{
				}
			}, function(error) {
			});
	};



	$scope.order = function(){
		$scope.resState = true;
		if($scope.input.imei == ""){
			my.alert("请输入或扫描手机IEMI码。");
		}else{
			dianpu_phoneGiveFee.imei = $scope.input.imei;
			$state.go("dianpu-cbss-phoneGiveFee-phoneList");
		}
	}
})



.controller('dianpu-cbss-phoneGiveFee-phoneList', function($scope, $state, unicomm_server, my) {

	$scope.title = "选择手机";
	$scope.select = {"elementMap":""};
	$scope.queryPhoneList = [];

	$scope.nocity = true;
	$scope.loading = false;
	$scope.resState = true;
	$scope.showList = true;

	unicomm_server.cbssLogin().then(function(){

		unicomm_server.getUnicomm({
				  "cmd":"cbss_product_getPhoneList"
				, "imei":dianpu_phoneGiveFee["imei"]
			})
			.then(
				function(result_json){
					if(result_json.status == "1"){
						$scope.loading = true;
						$scope.resState = false;
						$scope.showList = false;
						$scope.queryPhoneList = result_json.data;
					}else{
						my.alert(result_json.data);
					}
				}
				, function(textStatus, errorThrown){
				}
			)
		
	});

	$scope.order = function(){
		$scope.resState = true;
		if($scope.select.elementMap == ""){
			my.alert("请选择一款手机。");
		}else{
			dianpu_phoneGiveFee["phoneinfo"] = $scope.select.elementMap;
			$state.go("dianpu-cbss-phoneGiveFee-activity");
		}
	}

})


.controller('dianpu-cbss-phoneGiveFee-activity', function($scope, $rootScope, $http, $state, unicomm_server, my) {

	$scope.title = "购机赠费选择活动";
	$scope.select = {"elementMap":""};
	$scope.activityList = [];
	$scope.loading = false;
	$scope.resState = true;
	$scope.showList = true;

	dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"] = [];
	dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"] = "";

	unicomm_server.cbssLogin().then(function(){

		unicomm_server.getUnicomm({
				  "cmd":"showactivitydetail" 
				, "root":"SALE"
				, "productTypeCode":"GJRM001"
				, "productId":dianpu_cbss_package_array["sub_productObj"]["productId"]
				, "number":telInfo["tel"]
				, "deviceType":dianpu_phoneGiveFee["phoneinfo"]["resourcesModelCode"]
				, "deviceBrand":dianpu_phoneGiveFee["phoneinfo"]["resourcesBrandCode"]
				, "deviceNumber":dianpu_phoneGiveFee["phoneinfo"]["deviceno"]
			})
			.then(
				function(result_json){
					if(result_json.status == "1"){
						$scope.loading = true;
						$scope.resState = false;
						$scope.showList = false;
						$scope.activityList = result_json.data;
					}else{
						my.alert(result_json.data);
					}
				}
			)			
		
	});


	$scope.order = function(){
		$scope.loading = false;
		$scope.resState = true;
		if($scope.select.elementMap == ""){
			my.alert('请选择一个活动。').then(function(){
				$scope.loading = true;
				$scope.resState = false;
			});
		}else{
			for(var i in $scope.select.elementMap.package[0].element){
				dianpu_cbss_package_array["phoneGiveFee"]["sub_elementList"].push($scope.select.elementMap.package[0].element[i]);
				dianpu_cbss_package_array["phoneGiveFee"]["selecteElementCode"] += $scope.select.elementMap.package[0].element[i]["elementId"]+",";
			}
			delete $scope.select.elementMap.package;
			dianpu_cbss_package_array["phoneGiveFee"]["sub_productList"].push($scope.select.elementMap);

			$http({
				method: 'GET',
				url: ajaxurl + 'orderApp/updateActivityForShopNumberOrder?token='+ $rootScope.token,
				params : {"orderNo":authentication["orderNo"],"activityId":$scope.select.elementMap['productId'], "activityName":$scope.select.elementMap["productName"]}
			}).success(function(data){
				$state.go("authentication-device");
			}).error(function(data){
				my.alert("生成订单失败，请重新提交。").then(function(){
					$scope.loading = true;
					$scope.resState = false;
				});
			});
		}
	}
})
;