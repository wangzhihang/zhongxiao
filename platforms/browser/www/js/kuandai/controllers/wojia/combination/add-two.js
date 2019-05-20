appControllers.controller('kuandai-wojia-combination-add-two', function($scope, $state)
{
	$scope.title = "是否加装宽带";

	$scope.order = function(){
		kuandai_wojia_combination_addTwo = 1;
		$state.go("kuandai-wojia-address-area");
	}
	$scope.order2 = function(){
		kuandai_wojia_combination_addTwo = 1;
		$state.go("kuandai-submit");
	}
});