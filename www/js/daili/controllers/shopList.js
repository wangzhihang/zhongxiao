appControllers.controller('daili-shop-list', function($scope,$http,$rootScope,$timeout,$state,my,$ionicLoading) {
	$scope.title = '店铺列表';
	$scope.shopList = [];
	$scope.input = {keywords:''};

	$scope.searchBox = true;
	$scope.pageIndex = 1;
	$scope.pageSize = 10;
	//页面载入
	getShopList($scope.input.keywords,$scope.pageIndex);
	//搜索
	$scope.query = function(){
		$scope.shopList = [];
		$scope.pageIndex = 1;
		getShopList($scope.input.keywords,$scope.pageIndex);
	};
	//上拉加载 
    $scope.loadMore = function (){
    	$scope.pageIndex++; 
    	getShopList($scope.input.keywords,$scope.pageIndex); 
    };

	//获取店铺列表
	function getShopList(keywords,pageIndex){
		$ionicLoading.show({template: '数据加载中...'});
		$scope.loading = true;
		$scope.noMore = false;
		$http({
			method:'post',
			url:ajaxurl + 'userApp/getAgencyShopList?token=' + $rootScope.token,
			data:{keywords:keywords,pageIndex:pageIndex},
			timeout: 5000
		}).success(function(data){
			$ionicLoading.hide();
			//console.log(JSON.stringify(data));
			$scope.loading = false;		
			$scope.noMore = false;
			//console.log(eval(data.shopList['list']).length)
			//如果小于pageSize禁止上拉加载
			if(eval(data.shopList['list']).length < $scope.pageSize){
				$scope.hasmore = false;
				$scope.noMore = true;
			}else{
				$scope.hasmore = true;
			}
			$scope.shopList = $scope.shopList.concat(data.shopList['list']);
		}).error(function () { 
			 my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
		}).finally(function () { 
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	}
	//店铺详情页面
	$scope.shopDetail = function(index){
		localStorage.setItem('ownerId',index);
		$state.go('daili-shop');
	};
});