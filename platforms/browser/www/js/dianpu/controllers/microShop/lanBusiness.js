appControllers.controller('dianpu-lan-business', function($scope) {
	$scope.title = "宽带业务";
	$scope.groudIsHide=false;
	$scope.shareIsHide=false;
	$scope.countyIsHide=false;
	$scope.lanIsHide=false;
	appList();
	function appList(){
		for(var i in shopInfo.appFuncList){
			if(shopInfo.appFuncList[i].funcCode=='KD0000'){
				//console.log(shopInfo.appFuncList[i].funcCode);
				$scope.zhxData=shopInfo.appFuncList[i].appList;
				//console.log($scope.zhxData);
				for(var j in $scope.zhxData){
					if($scope.zhxData[j].funcCode=="000020"){
						$scope.groudIsHide=true;				
					}
					if($scope.zhxData[j].funcCode=="000021"){
						$scope.shareIsHide=true;				
					}
					if($scope.zhxData[j].funcCode=="000022"){
						$scope.lanIsHide=true;				
					}
					if($scope.zhxData[j].funcCode=="000030"){
						$scope.countyIsHide=true;				
					}
				}

				 if($scope.groudIsHide==false && $scope.shareIsHide==false && $scope.lanIsHide==false && $scope.countyIsHide==false){
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