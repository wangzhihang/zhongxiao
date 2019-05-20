appControllers.controller('dianpu-oldUser-change_order', function($scope, $state, my, $http, $rootScope, unicomm_server) {

	$scope.title = "老客户存费赠费";
	$scope.simInput = {"number":"","tel":"","money":"201"}
	$scope.resState = true;
	$scope.changeInfo = "";
	$scope.submitInfo = "";

	$scope.telChange = function(){
		$scope.simInput["tel"] = telFormat($scope.simInput["tel"]);
		if(String($scope.simInput["tel"]).replace(/[^\d]/g, "").length >= 11){
			$scope.simInput.number = String($scope.simInput["tel"]).replace(/[^\d]/g, "");
			$scope.resState = false;
		}else{
			$scope.resState = true;
		}
	}

	$scope.cbss_getcustomerinfo = function(){
		$scope.loading = true;
		unicomm_server.cbssLogin().then(
			function(){
				unicomm_server.getUnicomm({
					  "cmd":"cbss_fee_getcustomerinfo"
					, "number":$scope.simInput["number"]
					, "developcode":cbssInfo["developCode"]
					, "developname":cbssInfo["developName"]
				}).then(function(return_json){
					if(return_json.status == "1"){
						$scope.repeatToken = return_json.repeatToken;
						$scope.cbss_fee_payfee();
						// $scope.getOldUserInfo();
					}else{
						my.alert(return_json.data);
					}
				});
			}
		)
	}

	
	$scope.cbss_fee_payfee = function(){
		unicomm_server.getUnicomm({
			  "cmd":"cbss_fee_payfee"
			, "developcode":cbssInfo["developCode"]
			, "developname":cbssInfo["developName"]
			, "number":$scope.simInput["number"]
			, "money":String("1")
			, "repleattoken":$scope.repeatToken
		}).then(
			function(result_json){
				if(result_json.status == "1"){
					$scope.getOldUserInfo();
				}else{
					my.alert(result_json.data);
				}
			}
		)
			
	}

	$scope.getOldUserInfo = function(i)
	{
		unicomm_server.getUnicomm({
			 "cmd":"cbss_order_getOldUserInfo"
			,"serialNumber":$scope.simInput.number
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.changeInfo = return_json.data;
					$scope.changeOrderInfo();
				}else{
					my.alert(return_json.data);
				}
			}
		)
	}

	$scope.changeOrderInfo = function()
	{
		unicomm_server.getUnicomm({
			 "cmd":"cbss_order_changeOrderInfo"
			,"changeInfo":$scope.changeInfo
			,"productList":[{"endUnit":"3","enableTag":"1","brandCode":"-1","productType01":"0","declaredProductId":"","productTypeCode":"ZSDZQ002","startDate":"2018-05-11,13:44:36","endAbsoluteDate":"","productExplain":"","netTypeCode":"-1","compTag":"0","endOffset":"12","productMode":"50","resTypeCode":"","endEnableTag":"1","groupBrandCode":"-1,","startAbsoluteDate":"","productState":"4","minNumber":"-1","startOffset":"1","itemIce00Product":"2","version":"0","serviceId":"","maxNumber":"-1","startUnit":"3","useTag":"","endDate":"2018-12-31,23:59:59","needExp":"1","productName":"201805畅爽冰激凌套餐99元档预存200元送240元电子券(12)-陕西","productId":"90377745","modifyTag":"0","itemYcmpFee":"20000","productObjType":"0","itemZsdzqFeeMonth":"20","prepayTag":"0"}]
			,"elementList":[{"productId":"90377745","endUnit":"3","enableTag":"1","endAbsoluteDate":"","endOffset":"12","endEnableTag":"1","startAbsoluteDate":"","startOffset":"1","startUnit":"3","modifyTag":"0","elementId":"20685963","mutexStr":"","itemIndex":"0","elementTypeCode":"D","forceTag":"1","score":"-1","packageId":"52012142","svcStartMode":"0","elementDesc":";","paramvalue":"-1","spId":"-1","spProductId":"-1","firstmonthpaytype":"","rewardLimit":"-1","elementName":"预存200元;一次性到账200元;","hasAttr":"0","partyId":"-1","relyStr":"","defaultTag":"1"}]		
		}).then(
			function(return_json){
				console.log(return_json)
				if (return_json.status == '1') {
					$scope.submitInfo = return_json.data;
					$scope.submitorder();
				}else{
					my.alert(return_json.data);
				}
			}
		)
	}


	$scope.submitorder = function()
	{
		var cmd = $scope.submitInfo;
		cmd.cmd = "submitorder";
		cmd.isContainsFee = true;
		unicomm_server.getUnicomm(cmd).then(
			function(return_json){
				$scope.loading = false;
				console.log(return_json)
				my.alert(return_json.data)
			}
		)
	}

});