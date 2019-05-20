appControllers.controller('daili-salesman', function($scope,$http,$state,$rootScope,$ionicLoading,my,$filter,$ionicPopup) {
	$scope.title = '业务员名称';
	$scope.shopList = [];
	$scope.loading = true;
	// $ionicLoading.show({template: '数据加载中...'});
	$http({
		method:'get',
		url:ajaxurl + 'userApp/getAgencyDeveDetail?token=' + $rootScope.token,
		params:{deveId:localStorage.getItem('developId')},
		timeout: 10000
	}).success(function(data){
		// $ionicLoading.hide();x
		$scope.loading = false;
		//console.log(JSON.stringify(data));
		 $scope.title = data.developer.realName;
		$scope.headImgUrl = data.developer.headImgUrl;
		$scope.realName = data.developer.userName;
		$scope.numOrderCntThisMon = data.developer.numOrderCntThisMon;
		$scope.lanOrderCntThisMon = data.developer.lanOrderCntThisMon;
		$scope.shopCnt = data.developer.shopCnt;
		$scope.lastLoginTime = data.lastLoginTime;
		$scope.numOrderCnt=data.numOrderCnt;
		$scope.lanOrderCnt=data.lanOrderCnt;
		$scope.userId = data.developer.userId;
		
		$scope.shopList = data.shopList;
		if($scope.headImgUrl==""||$scope.headImgUrl==null){
			$scope.headImg=false;
		}
		else{
			$scope.headImg=true;
		}
	}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	$scope.orderJump=function(){
		// console.log("eee=="+e);
		$state.go('kk-order-list',{
			status:'000003',
			startTime:$filter('date')(new Date().setDate(1),'yyyy-MM-dd'),
			endTime:GetDateStr(1)
		});
	}
	//店铺跳转
	$scope.shopJump=function(userId){
		//console.log("eee=="+userId);
		$state.go('daili-shop-index',{
			userId:userId
		})
	}
	//店铺详情页面
	$scope.shopDetail = function(index){
		localStorage.setItem('ownerId',index);
		$state.go('daili-shop');
	};
	//重置密码
	$scope.resertPassword=function(){
		 var myPopup = $ionicPopup.show({
		   title: '提示信息',
		   template: '确认重置该用户密码？',
		   buttons:[
			{text:'取消'},
			{
				text:'<b>确定</b>',
				type:'button-positive',
				onTap:function(){
					//console.log("确定重置"+$scope.userId);
					$http({
						method:'get',
						url:ajaxurl+'userApp/setDefaultPwd?token=' + $rootScope.token,
						params:{userId:$scope.userId}
					}).success(function(data){
						   var alertPopup = $ionicPopup.alert({
					       title: '提示信息',
					       template: '新密码已重置为123456,请联系用户自行修改。'
					     });
					})
				}
			},
		   ]
		});
	}
});