appControllers.controller('dianpu-cbss-changshi-imei', function($scope, $state, $http, $cordovaBarcodeScanner, unicomm_server, my) {

	$scope.title = "畅视卡终端IMEI";
	$scope.input = {"imei":""};
	$scope.resState = false;


	$scope.order = function(){
		$scope.resState = true;
		unicomm_server.cbssLogin().then(function(){
			unicomm_server.getUnicomm({
					"cmd":"cbss_order_checkImei",
					"imei":$scope.input.imei 
				})
				.then(
					function(result_json){
						//console.log(result_json);
						if(result_json.status == "1"){
							changshiInfo.imei = $scope.input.imei;
							$state.go("dianpu-cbbs-package-result");
						}else{
							my.alert("该串码不是指定终端串码，请更换串码重新受理").then(function(){
								$scope.resState = false;
							});
						}
					}
					, function(){
						$scope.resState = false;
					}
				)
		});
	};

	$scope.qrImei = function(){
		$cordovaBarcodeScanner
			.scan()
			.then(function(barcodeData) {
				if(barcodeData.text){
					$scope.input.imei = barcodeData.text;
				}else{
				}
			}, function() {
			});
	};
});
