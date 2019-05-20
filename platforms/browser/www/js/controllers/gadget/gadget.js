//cbss工具列表
appControllers.controller('gadget', function($scope,$state, $cordovaBarcodeScanner, my) {
	$scope.title = "小工具";
	$scope.appFuncListShow = appFuncListShow;
	// 身份验证
	$scope.cbss_id_check = function(){
		service_type = "cbssIdCheck";
		$state.go("authentication-device");
	}
	//CBSS小工具
	$scope.gadgetCbss = function(){
		$state.go("gadget-cbss");
	}
	//BSS小工具
//	$scope.gadgetBss = function(){
//		$state.go("gadget-bss");
//	}

	$scope.clientQr = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					var orderArr = JSON.parse(barcodeData.text);
					if(orderArr.type == "photo"){
						$scope.photograph(orderArr.orderInfo);
					}else if (orderArr.type == "signature") {
						$scope.PCsignature(orderArr.orderInfo);
					}else{
						my.alert("无法识别的二维码！");
					}
				}else{
					my.alert("没有找到可识别的二维码！");
				}
		});
	}

	//手持身份证拍照
	$scope.photograph = function(){
		var orderNo = arguments[0];
		var orderArr = orderNo.split("WX");
		if(orderArr.length > 1){
			photoGraph_orderNo = "WX"+orderArr[1].replace(/[^\d]/g, "");
		}else{
			photoGraph_orderNo = "KD"+orderNo.split("KD")[1].replace(/[^\d]/g, "");
		}
		$state.go("gadget-photograph");
		// $cordovaBarcodeScanner
		// 	.scan()
		// 	.then(function(barcodeData) {
		// 		if(barcodeData.text){
		// 		}else{
		// 			my.alert("没有找到可识别的二维码！");
		// 		}
		// 	});
	}
	//客户端签名
	$scope.PCsignature = function(){
		// signature_orderNo = JSON.parse(barcodeData.text);
		signature_orderNo = arguments[0];
		$state.go("signature");
		// $cordovaBarcodeScanner
		// 	.scan()
		// 	.then(function(barcodeData) {
		// 		if(barcodeData.text){
		// 		}else{
		// 			my.alert("没有找到可识别的二维码！");
		// 		}
		// 	});
	}

	// 付款码临时
	$scope.paymentQrShow = userBo.userName == "c88" ? true : false;
})


.controller('gadget-myPaymentQr', function($scope,$state, $cordovaBarcodeScanner, my) {
	$scope.title = "我的付款码";

	
	$scope.shopName=shopInfo["shopBo"].shopName;
	$scope.shopTel=shopInfo["shopBo"].shopTel;

	$scope.textUrl="wxp://f2f0IL5zNjpvlsDvCDYpXyFuTSmklwhDBtVb";
	console.log($scope.textUrl);
	angular.element("#qrbox").qrcode({ 
		  "render": "canvas"
		, "width": 240
		, "height":240
		, "text": $scope.textUrl
	}); 
})