appControllers.controller('dianpu-qrgo-submitOrder', function($scope, $state, my, $http, $rootScope,unicomm_server) {

	$scope.title = "预占确认";

	$scope.inputInfo = {
		 "name":authentication["name"]
		,"cardId":authentication["cardId"]
		,"number":qrgoInfo.number
		,"contractNumber":authentication["contractNumber"]
	}

	$scope.submitOrder = function(i)
	{
		if(qrgoInfo.orderId){
			$state.go(jump[service_type]["signature"]);
		}else{
			unicomm_server.getUnicomm({
				 "cmd":"qrgo_submitOrder"
				,"provinceCode":qrgoInfo.provinceCode
				,"cityCode":qrgoInfo.cityCode
				,"number":qrgoInfo.number
				,"goodsId":qrgoInfo.goodsId
				,"name":authentication["name"]
				,"psptId":authentication["cardId"]
				,"contractNumber":$scope.inputInfo["contractNumber"]
			}).then(
				function(return_json){
					console.log(return_json)
					if (return_json.status == '1') {
						qrgoInfo.orderId = return_json.data;
						$state.go("signature");
					}else{
						my.alert(return_json.data); 
					}
				}
			)
		}
	}
})

;