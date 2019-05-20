appControllers.controller('dianpu-qrgoV2-number', function($scope, $state, my, unicomm_server) {

	$scope.title = "号码列表";
	$scope.loading = true;

	$scope.getNumberList = function(i)
	{
		unicomm_server.getUnicomm({
			"cmd":"qrgo2_getNumberList",
			"provinceCode":qrgoInfo.userInfo.provinceCode,
			"cityCode":qrgoInfo.userInfo.eparchyCode,
			"groupKey":"",
			"keyWord":"",
			"goodsId":order_info.productId
		}).then(
			function(return_json){
				$scope.loading = false;
				if (return_json.status == '1') {
					/*$scope.numberList = return_json.data;*/
					$scope.numberList = [];
					for(var i in return_json.data){
						$scope.numberList.push({
							"number":return_json.data[i],
							"numCutOne":return_json.data[i].substring(0, 3),
							"numCutTwo":return_json.data[i].substring(3, 7),
							"numCutThree":return_json.data[i].substring(7)
						})
				}
				}else{
					my.alert("获取号码列表失败!");
				}
			}
		)
	}
	$scope.getNumberList();


	$scope.occupyNumber = function(i)
	{
		qrgoInfo.number = $scope.numberList[i].number;
		order_info["number"] = qrgoInfo.number;
		$state.go("dianpu-qrgo-now-purchase");
	}

});