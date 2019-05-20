appControllers.controller('bss-shop-list', function($scope,$http,$state,$ionicLoading,my,$rootScope) {
	$scope.title = 'BSS店铺列表';
	$scope.bssId=localStorage.getItem('id');
	$scope.shopListId=[];
	$scope.shopList=new Array();
	$scope.quanxuan="全选";
	// $ionicLoading.show({template: '数据加载中...'});
	$scope.loading=false;
	$http({
		method:'get',
		url:ajaxurl + 'bssInfoApp/queryBssShopList?token=' + $rootScope.token,
		params:{bssId:$scope.bssId},
		timeout: 5000
	}).success(function(data){
		// $ionicLoading.hide();
		$scope.loading=true;
		//console.log(JSON.stringify(data));
		$scope.selectedList=data.selectedList;
		$scope.unSelectedList=data.unSelectedList;
		for(var i in $scope.selectedList){
			$scope.selectedList[i].aaa=true;
		}
		for(var i in $scope.unSelectedList){
			$scope.unSelectedList[i].aaa=false;
		}
		$scope.shopList=$scope.selectedList.concat($scope.unSelectedList);
		//console.log($scope.shopList);
	}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });

	
	//全选
	$scope.allChosed=function(m){
		if($scope.quanxuan=="全选"){
           		 for(var i in $scope.shopList){
	      			$scope.shopList[i].aaa = true;
	      		}
	      		$scope.quanxuan="取消";
          	 }else{
           		for(var i in $scope.shopList){
	      			$scope.shopList[i].aaa = false;
	      		}
           	$scope.quanxuan="全选";

           }
	}



	//保存
	$scope.savaData=function(){
		$scope.shopListId=new Array();
		 for(var i in $scope.shopList){
				var aaa=$scope.shopList[i].aaa;
				if(aaa==true){
					$scope.shopListId.push($scope.shopList[i].id);
				}
			}
			//console.log($scope.shopListId);
				$http({
						method:'post',
						url:ajaxurl + 'bssInfoApp/saveBssShopRel?token=' + $rootScope.token,
						data:{bssId:$scope.bssId,shopList:$scope.shopListId}
					}).success(function(data){
						//console.log(data);
					})
	}

});