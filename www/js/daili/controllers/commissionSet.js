appControllers.controller('commission-set', function($scope) {
	$scope.title = '佣金设置';
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
		}
	};
});