appControllers.controller('dianpu-hm-business', function($scope,$state, $ionicPopup) {
	$scope.title = "号码业务";
	$scope.bssIsNoShow=false;
	$scope.cbssIsNoShow=false;
		$scope.mybssList = function(pageTitle){
		$state.go('dianpu-mybss-list', {pageTitle:'WXBSS业务'});
	}
	$scope.mycbssList = function(pageTitle){
		$state.go('dianpu-mycbss-list', {pageTitle:'WXCBSS业务'});
	}
	appList();
	function appList(){
		for(var i in shopInfo.appFuncList){
			if(shopInfo.appFuncList[i].funcCode=='ZX0000'){
				//console.log(shopInfo.appFuncList[i].funcCode);
				$scope.zhxData=shopInfo.appFuncList[i].appList;
				//console.log($scope.zhxData);
				for(var j in $scope.zhxData){
					//console.log("显示");
					if($scope.zhxData[j].funcCode=="000005"  || $scope.zhxData[j].funcCode=="000023"){
						$scope.bssIsNoShow=true;
						//console.log("显示1");
					};
					 if($scope.zhxData[j].funcCode=="000004" || $scope.zhxData[j].funcCode=="000011"){
						$scope.cbssIsNoShow=true;
						//console.log("显示2");
					};					
				}
				 if($scope.bssIsNoShow==false && $scope.cbssIsNoShow==false){
						alertData('您暂时无权限办理此业务');
				};
			}
		}
		
	}
	
	//提示信息
	function alertData(info){
		var alertPopup = $ionicPopup.alert({
			    title: '提示信息',
			    template: info
			});
			alertPopup.then(function(res) {
			    //console.log('Thank you for not eating my delicious ice cream cone');
			});
	}
	
})