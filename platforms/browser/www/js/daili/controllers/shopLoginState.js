appControllers.controller('daili-shop-login-state', function($scope) {
	$scope.title = '店铺登录状态记录';
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
		}
	};
});