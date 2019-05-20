appControllers.controller('kuandai-wojia-iptvinfo', function($scope, $state, my, unicomm_server) {
	
	$scope.title = "参数设置";
	$scope.zfList = true;
	$scope.zfLoading = true;

	
	$scope.optionList = {
		// 包期执行方式
		"effectMode":[
			{"code":"0", "name":"立即生效"},
			{"code":"1", "name":"次月生效"}
		],
		// 到期处理方式 
		"expireDealMode":[
			{"code":"a", "name":"续包年"},
			{"code":"b", "name":"到期执行指定资费"},
			{"code":"t", "name":"到期停机"}
		],
	};

	// 双11
	if(shopInfo.shopBo.city == "7100000" && ["90376090","90344560","90376103"].indexOf(kuandai_combination["broadband"].productInfo.productId) !== -1){
		$scope.optionList.expireDealMode = [$scope.optionList.expireDealMode[0]];
	}
	
	$scope.kuandai_iptvinfo = {
		"effectMode":$scope.optionList.effectMode[0],
		// "cycleNum":$scope.optionList.cycleNum[0],
		"expireDealMode":"",
		"discntCode":""
	};

	$scope.discntCode = function(){
		if($scope.kuandai_iptvinfo.expireDealMode.code == "t"){
		}else{
			$scope.zfLoading = false;
			$scope.zfList = true;
			var sourceType = $scope.kuandai_iptvinfo.expireDealMode.code == "a" ? "B_DISCNT_CODE" : "A_DISCNT_CODE"
			unicomm_server.getUnicomm(
				{
					"cmd":"cbss_lan_getChangeSource"
					,"lanProductId":kuandai_combination["broadband"].productInfo.productId
					,"lanPackageId":lanElementId.packageId
					,"lanElementId":lanElementId.elementId
					,"sourceType":sourceType
				}
			).then(
				function(data){
					$scope.discntCodeList = data.data;
					$scope.kuandai_iptvinfo.discntCode = $scope.discntCodeList[0];
					$scope.zfLoading = true;
					$scope.zfList = false;
				}
			);
		}
	}


	
	$scope.order = function(){
		if( $scope.kuandai_iptvinfo.expireDealMode === "" || 
			($scope.kuandai_iptvinfo.expireDealMode.code != "t" && $scope.kuandai_iptvinfo.discntCode == "")
		){
			my.alert("请选择到期处理方式！");
			return ;
		}

		kuandai_iptvinfo = {
			"adEnd":"",
			"cycle":"12",
			"fixedHire":"12",
			"cycleFee":"240",
			"recharge":"",
			"callBack":"0",
			"cycleNum":"1"
		};
	
		// vinfo["cycleNum"] = $scope.kuandai_iptvinfo.cycleNum.code;
		kuandai_iptvinfo["effectMode"] = $scope.kuandai_iptvinfo.effectMode.code;
		kuandai_iptvinfo["expireDealMode"] = $scope.kuandai_iptvinfo.expireDealMode.code;
		kuandai_iptvinfo["aDiscntCode"] = "";
		kuandai_iptvinfo["bDiscntCode"] = "";
		if(kuandai_iptvinfo["expireDealMode"] == "a"){
			kuandai_iptvinfo["bDiscntCode"] = $scope.kuandai_iptvinfo.discntCode.key;
		}else if(kuandai_iptvinfo["expireDealMode"] == "b"){
			kuandai_iptvinfo["aDiscntCode"] = $scope.kuandai_iptvinfo.discntCode.key;
		}
		
		if(["90344527", "90344560"].indexOf(kuandai_combination["broadband"].productInfo.productId) !== -1 ){
			kuandai_iptvinfo.cycle = "1";
			kuandai_iptvinfo.fixedHire = "1";
			kuandai_iptvinfo.cycleFee = "0"

			if(kuandai_combination["broadband"].productInfo.productId == "90344527"){
				if(kuandai_iptvinfo["expireDealMode"] == "a" || kuandai_iptvinfo["expireDealMode"] == "b"){
					kuandai_iptvinfo["aDiscntCode"] = "8299029";
					kuandai_iptvinfo["bDiscntCode"] = "8299017";
				}else if(kuandai_iptvinfo["expireDealMode"] == "t"){
					kuandai_iptvinfo["aDiscntCode"] = "8299029";
					kuandai_iptvinfo["bDiscntCode"] = "";
				}				
			}

			if(kuandai_combination["broadband"].productInfo.productId == "90344560"){
				if(kuandai_iptvinfo["expireDealMode"] == "a" || kuandai_iptvinfo["expireDealMode"] == "b"){
					kuandai_iptvinfo["aDiscntCode"] = "8299037";
					kuandai_iptvinfo["bDiscntCode"] = "8299025";
				}else if(kuandai_iptvinfo["expireDealMode"] == "t"){
					kuandai_iptvinfo["aDiscntCode"] = "8299037";
					kuandai_iptvinfo["bDiscntCode"] = "";
				}
			}
		}

		if(["90362280", "90409034"].indexOf(kuandai_combination["broadband"].productInfo.productId) !== -1){
			kuandai_iptvinfo["expireDealMode"] == "t"
			kuandai_iptvinfo["aDiscntCode"] = "8335845";
			if(kuandai_combination["broadband"].productInfo.productId == "90362280"){
				kuandai_iptvinfo.cycle = "3"
				kuandai_iptvinfo.fixedHire = "3";
			}else if(kuandai_combination["broadband"].productInfo.productId == "90409034"){
				kuandai_iptvinfo.cycle = "6"
				kuandai_iptvinfo.fixedHire = "6";
			}
		}
		// 双11
		if(["90376090","90376103"].indexOf(kuandai_combination["broadband"].productInfo.productId) !== -1){
			kuandai_iptvinfo.cycleNum = "1"
			kuandai_iptvinfo.cycle = "24"
			kuandai_iptvinfo.fixedHire = "24"
		}
		if(["90344560"].indexOf(kuandai_combination["broadband"].productInfo.productId) !== -1){
			kuandai_iptvinfo.cycleNum = "1"
			kuandai_iptvinfo.cycle = "12"
			kuandai_iptvinfo.fixedHire = "12"
		}
		kuandai_combination["broadband"].productInfo
		if(["wojia-combination-56", "wojia-combination-88", "wojia-combination-88b"].indexOf(service_type) == -1){
			$state.go("kuandai-wojia-select-terminals");
		}else{
			$state.go("kuandai-wojia-combination-activity");
		}
	}
});