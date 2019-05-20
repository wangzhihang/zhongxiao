appControllers.controller('shop-inspection', function($scope,$rootScope,$http,$state,$ionicLoading,my) {
	$scope.title = '巡店';
	// $ionicLoading.show({template: '数据加载中...'});
	$scope.loading=false;
	$http({
		method: 'GET',
		url: ajaxurl + "userApp/queryMapMarker?token=" + $rootScope.token,
		// params: {"userId":signInInfo.userInfo.userId}
	}).success(function(data){
		// $ionicLoading.hide();
		$scope.loading=true;
		console.log(JSON.stringify(data));
		$scope.shopList = data["shopList"];
		console.log($scope.shopList);

		 var markers = []; 
		 var map = new AMap.Map('mapContainer', {
	                center: [108.927425,34.216047],
	                zoom: 10
	            });
		for(var i=0;i<$scope.shopList.length;i++){
			var marker;
			//根据经纬度获取并显示地图
			$scope.lnglarArr=[];
			if($scope.shopList[i].lnglats!=null){
				//$scope.getMap($scope.longitude,$scope.latitude);
				//console.log($scope.shopList[i].lnglats.split(','));
	            marker=new AMap.Marker({
	                position:$scope.shopList[i].lnglats.split(','),
	                map:map
	            });
			}
				
			markers.push(marker);
		}

		//店铺详情页面
		/*$scope.shopDetail = function(index,imgUrl,id){
			localStorage.setItem('ownerId',index);
			localStorage.setItem('imgUrl',imgUrl);
			localStorage.setItem('shopId',id);
			$state.go('daili-shop');
		};*/

		//巡店
		$scope.shopInspection=function(ownerId){
			console.log('ownerId=='+ownerId);
			localStorage.setItem('ownerIdShop',ownerId);

			$state.go('shop-inspection-list');
		}

	}).error(function () {
         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
                $state.go('index_dl');
            }); 
    });
})
