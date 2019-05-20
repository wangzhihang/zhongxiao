appControllers.controller('daili-shop-set', function($scope,$http,$rootScope,my,$state,$filter,$ionicLoading,my,$state,$ionicPopup) {
	$scope.title = '店铺设置';
	$scope.editShop="编辑";
	$scope.editVal = false;
	$scope.showData = true;
	$scope.ownerId = localStorage.getItem('ownerId');
	$scope.currentDate = $filter('date')(new Date(),'yyyy-MM-dd');
	// $ionicLoading.show({template: '数据加载中...'});
	$http({
		method:'post',
		url:ajaxurl + 'userApp/queryShopDetail?token=' + $rootScope.token,
		data:{userId:$scope.ownerId,date:$scope.currentDate},
		timeout: 10000
	}).success(function(data){
		// $ionicLoading.hide();
		console.log("aaaaaa"+JSON.stringify(data));
		//$scope.shopInfo=data.shopInfo;
		$scope.shopName=data.shopInfo.shopName;
		$scope.agencyTel=data.shopInfo.agencyTel;
		$scope.realName=data.shopInfo.realName;
		$scope.address=data.shopInfo.address;
		$scope.cuserName=data.shopInfo.cuserName;
		$scope.minBalance=data.shopInfo.minBalance;
		if($scope.minBalance==null||$scope.minBalance==""){
			$scope.minBalance=0;
		}
		
	}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	$scope.powerDivsion=function(){
		$state.go("daili-dianpu-power-divsion");
	}
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
					//console.log("确定重置");
					$http({
						method:'get',
						url:ajaxurl+'userApp/setDefaultPwd?token=' + $rootScope.token,
						params:{userId:$scope.ownerId}
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
	//编辑店铺信息
	/*$scope.upShopData=function(){
		//console.log("111"+$scope.shopName);
		if($scope.editShop=="编辑"){
			$scope.editShop="完成";
			$scope.editVal=true;
			$scope.showData=false;
		}else{
			$scope.editShop="编辑";
			$scope.editVal=false;
			$scope.showData=true;
			$http({
				method:"get",
				url: ajaxurl + "userApp/saveShop?token=" + $rootScope.token,
				params: {"shopName":$scope.shopName,"minBalance":$scope.minBalance,"address":$scope.address}
			}).success(function(data){
				$scope.editVal=false;
				$scope.showData=true;
				$ionicLoading.show({"template":'店铺信息更新成功！'});
		    	$timeout(function () {$ionicLoading.hide();}, 1500);
			});
		}
	}*/
});