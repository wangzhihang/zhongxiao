appControllers.controller('dianpu-grap-order-manage', function($scope,$state,$ionicPopup,$stateParams) {
	$scope.title = "办理业务";
	//console.log("$stateParams.number  " +$stateParams.number +" "+ $stateParams.orderCode);
	$scope.lanList = function(pageTitle){
		 wx_order = {
            "number":$stateParams.number
          , "orderCode":$stateParams.orderCode
          , "orderStatus":"000003"
          , "orderType":"000002"
          , "category":"000003"
          , "userId":""
        }
		$state.go('dianpu-grap-order-lan', {pageTitle:'WXBSS业务'});
	}
	$scope.hmList = function(pageTitle){
		 wx_order = {
            "number":$stateParams.number
          , "orderCode":$stateParams.orderCode
          , "orderStatus":"000003"
          , "orderType":"0000001"
          , "category":"000003"
          , "userId":""
        }
		$state.go('dianpu-hm-business', {pageTitle:'WXCBSS业务'});
	}
	
	
	
})