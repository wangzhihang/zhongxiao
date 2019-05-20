appControllers.controller('dianpu-semiManufactures-sim', function($scope, $rootScope, $http, $state, $cordovaBarcodeScanner, my, semiManufacturesSIM) {

	$scope.title = "获取ICCID卡号";
	$scope.btnText = {"read":"读卡","write":"办理"};	// 读写卡按钮文字

	$scope.btnDisplay = [false, true];	// 按钮显示控制
	$scope.btnActive =  false;	// 按钮选中控制

	$scope.simInput = {"simcard":""}


	$scope.scan = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					$scope.simInput.simcard = barcodeData.text;
					$scope.simcardInput();
				}else{
					my.alert("读取卡号不完整,请重新扫描一次。").then(function(){
						$scope.btnActive =  false;
					});
				}
			});
	};

	$scope.simcardInput = function(){
		if($scope.simInput.simcard.length >= 19){
			// 读卡消失,写卡浮现
			$scope.btnDisplay = [true, false];	// 按钮显示控制
		}else{
			$scope.btnDisplay = [false, true];	// 按钮显示控制
		}
		$scope.btnActive =  false;	// 按钮选中控制
	}


	$scope.order = function(){
		order_info["simInput"] = $scope.simInput.simcard;
		semiManufacturesSIM.rule(order_info["simInput"]).then(function(data){
			order_info["sectionNumber"] = data;
			$state.go("number-list");
		})
	}
})
//"8986011728810126726"