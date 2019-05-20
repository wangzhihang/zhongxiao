appControllers.controller('shop-inspection-list', function($scope,$filter,$rootScope,$http,$state,$ionicLoading,my) {
	$scope.title = '巡店列表';
	$scope.ownerId = localStorage.getItem('ownerIdShop');
	//console.log($scope.ownerId);
	$scope.currentDate = $filter('date')(new Date(),'yyyy-MM-dd');
	// $ionicLoading.show({template: '数据加载中...'});
	$scope.loading=false;
	$scope.isShowGoShopRecords=true;
	$http({
		method:'post',
		url:ajaxurl + 'userApp/queryShopDetail?token=' + $rootScope.token,
		data:{userId:$scope.ownerId,date:$scope.currentDate}
	}).success(function(data){
		// $ionicLoading.hide();
		$scope.loading=true;
		//console.log(JSON.stringify(data));
		$scope.realName = data.shopInfo.realName;
		$scope.shopTel = data.shopInfo.contractNumber;
		$scope.cuserName = data.shopInfo.cuserName;
		$scope.address = data.shopInfo.address;

		$scope.visitList = data.visitList;
		//console.log("visitList=="+$scope.visitList.length);
		if($scope.visitList.length==0){
			$scope.isShowGoShopRecords=false;
		}
		
		$scope.shopInspectionInfo=function(id,shopId,visitorId,visitorName,feedback){
			localStorage.setItem('shopInspectionId',id);
			localStorage.setItem('shopId',shopId);
			localStorage.setItem('visitorId',visitorId);
			localStorage.setItem('visitorName',visitorName);
			//localStorage.setItem('feedback',feedback);
			$state.go('shop-inspection-info',{id: id});
		}

	}).error(function () {
         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                $state.go('index_dl');
            }); 
    });
})
