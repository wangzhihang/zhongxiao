appControllers.controller('dianpu-mycbss-list', function($scope) {
	$scope.title = "CBSS业务";
	$scope.cbssIsNoShow=false;
	$scope.payIsNoShow=false;
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
					if($scope.zhxData[j].funcCode=="000004" ){
						$scope.cbssIsNoShow=true;
						//console.log("显示1");
					}
					if($scope.zhxData[j].funcCode=="000011"){
						$scope.payIsNoShow=true;
						//console.log("显示2");
					}
				}
			}
		}				
	}
})