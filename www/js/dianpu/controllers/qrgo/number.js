appControllers.controller('dianpu-qrgo-number', function($scope, $state, my, $http, $rootScope, unicomm_server) {

	$scope.title = "号码列表";

	$scope.loading = true;

	$scope.getNumberList = function(i)
	{
		unicomm_server.getUnicomm({
			 "cmd":"qrgo_getNumberList"
			,"provinceCode":qrgoInfo.provinceCode
			,"cityCode":qrgoInfo.cityCode
			,"groupKey":qrgoInfo.groupKey
			,"keyWord":""

		}).then(
			function(return_json){
				$scope.loading = false;

				if (return_json.status == '1') {

					/*$scope.numberList = return_json.data;*/

					 $scope.numberList = [];
					for(var i in return_json.data){
						$scope.numberList.push({
							"number":return_json.data[i]
							, "numCutOne":return_json.data[i].substring(0, 3)
							, "numCutTwo":return_json.data[i].substring(3, 7)
							, "numCutThree":return_json.data[i].substring(7)
							
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
		unicomm_server.getUnicomm({
			 "cmd":"qrgo_occupyNumber"
			,"provinceCode":qrgoInfo.provinceCode
			,"cityCode":qrgoInfo.cityCode
			,"number":qrgoInfo.number
			,"goodsId":qrgoInfo.goodsId
		
		}).then(
			function(return_json){
				console.log(return_json)
				if (return_json.status == '1') {
					app = "dianpu"
					order_type = "kaika"
					number_pool = "QRGO"
					service_type = "qrgo"
					source = "000028"; 
					sourceName = "2i产品"
					order_info["number"] = qrgoInfo.number;
					$state.go("authentication-device")
				}else{
					my.alert("预占号码失败!");
				}
			}
		)
	}



//模糊搜索
// $scope.searchUnicommTel = function(){
// 		$scope.domore = false;
// 		$scope.loading = [false, true, true];
// 		$scope.numberList = [];
// 		$ionicScrollDelegate.scrollTop();
// 		// $scope.pageIndex = 1;
		
// 		filterSelect["lh_type"] = "-1";
// 		filterSelect["deposit"] = "-1";
// 		// $scope.oneUnicommTelList();
// }









});