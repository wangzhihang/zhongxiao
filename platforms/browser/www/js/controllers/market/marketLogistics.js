appControllers.controller('market-logistics', function($scope,$stateParams) {
	$scope.title = '物流信息';
	$scope.orderCode=$stateParams.orderCode;



    console.log("物流"+$scope.orderCode);

});