appControllers.controller('dianpu-bss-package-list', function($scope, $state, my, unicomm_server) {

	$scope.title = "套餐";
	$scope.packageList = Array2delArray(dianpu_bss_package_array["bssPackageList"], ["101183", "101003", "84543", "103974", "103568", "103569", "106176", "106177"], "productId");
	// if(service_type == "telSelectNewBSS"){
	// 	$scope.packageList = Array2delArray(dianpu_bss_package_array["bssPackageList"], "productId", ["109170"]);	
	// }
	$scope.packageList.push({"productId":"104968", "productName":"BSS沃家欢4G融合专用卡"});

	$scope.details = function(id){
		my.loaddingShow();
		unicomm_server.getUnicomm({
			  "cmd":"bss_getProductDetail"
			,"productId":$scope.packageList[id]["productId"]})
		.then(
			function(return_json){
				my.loaddingHide();
				if (return_json.status == '1') {
					my.alert(return_json.data, $scope.packageList[id].productName);
				}else{
					my.alert("获取详情失败!");
				}
			}
		)
	}


	$scope.order = function(index)
	{
		dianpu_bss_package_array["bssPackageSelect"] = $scope.packageList[index];
		order_info["number"] = telInfo['tel']
		order_info["productId"] = dianpu_bss_package_array["bssPackageSelect"]["productId"]
		order_info["productName"] = dianpu_bss_package_array["bssPackageSelect"]["productName"]
		if(["109170", "111167"].indexOf(order_info["productId"])  == -1){
			$state.go(jump[service_type]['dianpu-bss-package-list']);
		}else{
			$state.go("dianpu-bss-package-huinongka");
		}
	}

})


// 惠农卡
.controller('dianpu-bss-package-huinongka', function($scope, $state, my, $http, $rootScope) {

	$scope.title = "附加包选择";
	$scope.nocity = true;

	$http({
		url : "data/bss/"+order_info["productId"]+"/"+userBo.disId+".json",
		method : "GET"
	}).success(function(data) {
		$scope.huinongkaList = data;
	}).error(function() {
		$scope.nocity = false;
	});
	$http({
		url : "data/bss/"+order_info["productId"]+"/string.txt",
		method : "GET"
	}).success(function(data) {
		$scope.busPropertyList = data;
	}).error(function() {
		$scope.nocity = false;
	});


	$scope.order = function(index)
	{
		bss_huinongka = sprintf($scope.busPropertyList, $scope.huinongkaList[index]);
		$state.go(jump[service_type]['dianpu-bss-package-list']);
	}

})


;