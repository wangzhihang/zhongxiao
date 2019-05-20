appControllers.controller('dianpu-grap-order-lan', function($scope,$state, $ionicPopup) {
	$scope.title = "宽带业务";
	$scope.dianpuKdList = function(pageTitle){
		$state.go('dianpu-kd-list', {pageTitle:'宽带业务'});
	}
	
})