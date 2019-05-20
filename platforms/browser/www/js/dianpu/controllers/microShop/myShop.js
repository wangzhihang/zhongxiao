appControllers.controller('dianpu-my-shop', function($scope,$state) {
	$scope.title = "我的微店";
	
	$scope.weiDian = function(pageTitle){
		$state.go('dianpu-wei-dian', {pageTitle:'我的微店'});
	}
	
	$scope.hmOrderList = function(pageTitle){
		$state.go('dianpu-hm-order-list', {pageTitle:'号码预存订单'});
	}
	$scope.lanOrderList = function(pageTitle){
		$state.go('dianpu-lan-order-list', {pageTitle:'宽带预存订单'});
	}
	$scope.myCode = function(pageTitle){
		$state.go('dianpu-my-code', {pageTitle:'我的二维码'});
	}
	$scope.statistical =function(){
		$state.go('dianpu-wx-statistical', {pageTitle:'店铺统计'});
	}
	$scope.otherAccept =function(){
		$state.go('dianpu-wx-other-accept', {pageTitle:'异业统计'});
	}

})