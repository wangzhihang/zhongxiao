appControllers.controller('dianpu-qrgo-protocol-details', function($scope) {
	$scope.title = "客户入网服务协议";
    $scope.qrgoInfo=qrgoInfo;
    $scope.order_info=order_info;
    $scope.authentication = authentication;
	$scope.signTime = new Date();
});