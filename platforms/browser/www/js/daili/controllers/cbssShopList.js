appControllers.controller('cbss-shop-list', function($scope,$http,$state,$rootScope,$ionicLoading,my) {
	$scope.title = 'CBSS店铺列表';
	$scope.cbssId=localStorage.getItem('id');
	$scope.selectedListId=[];
	$scope.shopList=[];
	$scope.quanxuan="全选";
	// $ionicLoading.show({template: '数据加载中...'});
	$scope.loading=false;
	$http({
		method:'get',
		url:ajaxurl + 'cbssInfoApp/queryCbssShopList?token=' + $rootScope.token,
		params:{cbssId:$scope.cbssId},
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
						url:ajaxurl + 'cbssInfoApp/saveCbssShopRel?token=' + $rootScope.token,
						data:{cbssId:$scope.cbssId,shopList:$scope.shopListId}
					}).success(function(data){
						//console.log(data);
					})
	}
});