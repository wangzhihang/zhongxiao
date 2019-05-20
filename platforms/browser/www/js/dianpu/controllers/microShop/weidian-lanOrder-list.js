appControllers.controller('dianpu-weidian-lanOrder-list', function($scope,$rootScope,$http,$state) {
	$scope.title = "宽带订单";

// $scope.shopOrderList = [];

//    console.log("01213122131")


//    $scope.finishList = [];
//    $scope.unfinishList = [];








$scope.tag = {
	lanordType: "1"
};

$scope.actions = {
	setLanOrdType: function (param) {
		$scope.tag.lanordType = param;


        }

	};






})