appControllers.controller('scan-code-order-detail', function($scope,$http,$stateParams,$state) {
	$scope.title = "订单详情";
	$scope.orderItem=JSON.parse(localStorage.getItem('orderItem'));
	console.log($scope.orderItem);
	switch($scope.orderItem.orderType){
        case 1:
            $scope.orderTypeVal='号码订单';
            break;
        case 2:
            $scope.orderTypeVal='融合订单';
            break;
        case 3:
            $scope.orderTypeVal='单宽订单';
            break;
    }
    switch($scope.orderItem.type){
        case '000001':
            $scope.typeVal='自提';
            break;
        case '000002':
            $scope.typeVal='上门';
            break;
    }
    $scope.lookOrder = function(orderType){
    	order["orderCode"]=$scope.orderItem.orderCode;
    	if(orderType==1){
    		$state.go("numberOrderDetail");
    	}else{
    		$state.go("kdOrderDetail");
    	}
    }
})