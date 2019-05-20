appControllers.controller('dianpu-cbss-oldUserInfo', function($scope, $state, unicomm_server, my) {

	$scope.title = "老客户签转";
	$scope.input = {"serialNumber":"","package":""};

	
	$scope.loading = false;
	$scope.resState = false;
	$scope.goEditDow = false;
	$scope.baochiBut = true;

	$scope.order = function(){
		$scope.resState = true;
		$scope.loading = true;
		if($scope.input.serialNumber.replace(/[^\d]/g, "").length < 11){
			$scope.loading = false;
			$scope.resState = false;
			my.alert("请输入正确的手机号码");
			return ;
		}
		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
				"cmd":"cbss_order_getOldUserInfo",
				"serialNumber":$scope.input.serialNumber.replace(/[^\d]/g, "")
			}).then(
				function(result_json){
					$scope.loading = false;
					$scope.resState = false;
					console.log(JSON.stringify(result_json) )
					if(result_json.status == "1"){
						var alertText = "";
						var oldPackage = "";
						for(var i in result_json.data.oldProductInfo){
							if(result_json.data.oldProductInfo[i].PRODUCT_MODE == "50"){
								alertText = "号码现有活动：<br>"+result_json.data.oldProductInfo[i].PRODUCT_NAME+"<br><span style='color:#F00'>暂时无法办理其他活动!</span>"
							}
							if(result_json.data.oldProductInfo[i].PRODUCT_MODE == "00"){
								oldPackage = result_json.data.oldProductInfo[i].PRODUCT_NAME;
							}
						}
						if(alertText == ""){
							$scope.goEditDow = true;
							$scope.input.package = oldPackage;
							changeOrderInfo = result_json.data;
							changeOrderInfo.oldProductName = oldPackage;
							telInfo["tel"] = result_json.data.number;
							if(["90356341", "90356344", "90356346"].indexOf(changeOrderInfo.oldProductId) === -1){
								$scope.baochiBut = false;
							}
						}else{
							my.alert(alertText);
						}
					}else{
						my.alert(result_json.data);
					}
				},function(){
					$scope.loading = false;
					$scope.resState = false;
				}
			)
		});
	}

	$scope.telChange = function(){
		$scope.goEditDow = false;
		$scope.input["serialNumber"] = telFormat($scope.input["serialNumber"]);
		if(String($scope.input["serialNumber"]).replace(/[^\d]/g, "").length >= 11){
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}

	$scope.goEdit = function(){
		source = "000113";
		$state.go("dianpu-cbss-package-list");
	}
	$scope.go = function(){
		$state.go("dianpu-cbss-phoneGiveFee");
	}
})
;