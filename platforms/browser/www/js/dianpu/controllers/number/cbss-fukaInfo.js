appControllers.controller('dianpu-cbss-fukaInfo', function($scope, $state, unicomm_server, my) {

	dianpu_cbss_zkInfo = "";
	dianpu_cbss_zf_tradeType = "0";

	$scope.loading = true;
	$scope.resState = true;
	$scope.title = "主卡信息";
	$scope.input = {
		"mainCardSerialNumber":"",
		"serialNumber":telInfo['tel'],
		"cardId":authentication["cardId"],
		"custName":authentication["name"]
	};

	// 自动添加主卡号码
	if(wx_order["zhukaNumber"]){
		$scope.input.mainCardSerialNumber = wx_order["zhukaNumber"];
		$scope.input.readonly = {
			"mainCardSerialNumber":true,
			"serialNumber":false
		}
	}else{
		if(wx_order.number){
			$scope.input.readonly = {
				"mainCardSerialNumber":false,
				"serialNumber":false
			}
		}else{
			$scope.input.readonly = {
				"mainCardSerialNumber":false,
				"serialNumber":true
			}
		}
	}


	$scope.order = function(){
		$scope.resState = true;
		$scope.loading = false;
		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
					"cmd":"cbss_order_getMainCardInfo",
					"mainCardSerialNumber":$scope.input.mainCardSerialNumber.replace(/[^\d]/g, ""), //主卡号码
					"serialNumber": telInfo['tel'],		//副卡号码
					"cardId":authentication["cardId"],
					"custName":authentication["name"]
				})
				.then(
					function(result_json){
						if(result_json.status == "1"){
							dianpu_cbss_zf_tradeType = "3";
							dianpu_cbss_zkInfo = result_json.data;
							telInfo["productId"] = "89128067";
							order_info = {
								"number":telInfo['tel'],
								"productId":"89128067",
								"productName":"4G副卡"
							}
							$state.go("dianpu-cbbs-package-result");
						}else{
							my.alert(alertInfo(result_json.data)).then(function(){
								$scope.resState = false;
								$scope.loading = true;
							});
						}
					}
					, function(){
						$scope.resState = false;
						$scope.loading = true;
					}
				)
		});
	};

	$scope.telChange = function(){
		
		$scope.input["mainCardSerialNumber"] = telFormat($scope.input["mainCardSerialNumber"]);
		$scope.input["serialNumber"] = telFormat($scope.input["serialNumber"]);
		if(String($scope.input["mainCardSerialNumber"]).replace(/[^\d]/g, "").length >= 11
		&& String($scope.input["serialNumber"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}
	$scope.telChange();
});
