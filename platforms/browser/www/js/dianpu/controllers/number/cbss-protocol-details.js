appControllers.controller('dianpu-cbss-protocol-details', function($scope,$http,$rootScope,$filter) {
	$scope.title = "客户入网服务协议";
    $scope.userOrderNumber = localStorage.getItem('userOrderNumber');
    $scope.userOrderName = 	localStorage.getItem('userOrderName');
    $scope.userOrderCardId = localStorage.getItem('userOrderCardId');
    $scope.userOrderCityName = localStorage.getItem('userOrderCityName');
    $scope.signTime = new Date();
    $scope.telInfo = telInfo;
    if($scope.telInfo.goodType){
		$scope.beginTime = $filter('date')($scope.signTime,"yyyy-MM-dd").split("-");
		$scope.stopTimeY = Number($scope.beginTime[0])+(telInfo.leaseLength.replace(/[^\d]/g, ""))/12 + Number($scope.beginTime[1] == "12" ? 1 : 0);
		$scope.currency = convertCurrency(telInfo.preCharge)
		$scope.leaseLength =telInfo.leaseLength.replace(/[^\d]/g, "");
		console.log("$scope.leaseLengt",$scope.leaseLength)
	};
	// $scope.leaseLength = telInfo.leaseLength.replace(/[^\d]/g, "")
	// $scope.cateCode = localStorage.getItem('userOrderCityName');
	// $scope.getCityName = function(cateCode){
	// 	$http({
	// 		    "method": 'get', 
	// 			"url" : ajaxurl + 'cateApp/queryCateNameByCateCode?token=' + $rootScope.token,
	// 			"params": {
	// 			cateCode:$scope.cateCode
	// 		}
	// 	}).success(function(data){
	// 		$scope.cityName = data.provices[0].cateName;
	// 	}).error(function(){
	// 	});
	// };     
	// $scope.getCityName($scope.cateCode); 
});