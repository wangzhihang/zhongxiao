appControllers.controller('dianpu-mybss-list', function($scope) {
	$scope.title = "BSS业务";
	$scope.bssIsNoShow=false;
	$scope.dailiIsNoShow=false;
//	$scope.lanOrderList = function(pageTitle){
//		$state.go('dianpu-lan-order-list', {pageTitle:'宽带预存订单'});
//	}
//	$scope.myCode = function(pageTitle){
//		$state.go('dianpu-my-code', {pageTitle:'我的二维码'});
//	}
	appList();
	function appList(){
		for(var i in shopInfo.appFuncList){
			if(shopInfo.appFuncList[i].funcCode=='ZX0000'){
				//console.log(shopInfo.appFuncList[i].funcCode);
				$scope.zhxData=shopInfo.appFuncList[i].appList;
				//console.log($scope.zhxData);
				for(var j in $scope.zhxData){
					//console.log("显示1");
					if($scope.zhxData[j].funcCode=="000005" ){
						$scope.dailiIsNoShow=true;
						//console.log("显示1");
					}
					if($scope.zhxData[j].funcCode=="000023"){
						
						$scope.bssIsNoShow=true;
						//console.log("显示2");
					}
				}
			}
		}				
	}
})