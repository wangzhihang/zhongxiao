appControllers.controller('daili-dianpu-power-divsion', function($scope,$http,$state,$rootScope,$ionicLoading,my) {
	$scope.title = '店铺权限分配';
	$scope.quanxuan="全选";
	$scope.selectedList=[];
	$scope.unSelectedList=[];
	$scope.shopRoleList=[];
	$scope.shopRoleListId=[];
	//console.log("owner==="+localStorage.getItem("ownerId"));
	$scope.ownerId=localStorage.getItem("ownerId");
	$ionicLoading.show({template: '数据加载中...'});
	$http({
		method:'get',
		url:ajaxurl + 'userApp/queryAppUserRoleByCuserId?token=' + $rootScope.token,
		params:{appUserId:$scope.ownerId},
		timeout: 5000
	}).success(function(data){	
		$ionicLoading.hide();	
		//console.log(JSON.stringify(data));
		$scope.selectedList=data.selectedList;
		$scope.unselectedList=data.unselectedList;
		for(var i in $scope.selectedList){
			$scope.selectedList[i].isCheck=true;
		}
		for(var i in $scope.unselectedList){
			$scope.unselectedList[i].isCheck=false;
		}
		$scope.shopRoleList=$scope.selectedList.concat($scope.unselectedList);
		//console.log($scope.shopRoleList);
	}).error(function () {
             my.alert('数据信息获取失败！请稍后尝试。').then(function(){
	                $state.go('index_dl');
	            }); 
        });
	//全选
	$scope.allChosed=function(m){
		if($scope.quanxuan=="全选"){
            for(var i in $scope.shopRoleList){
	      			$scope.shopRoleList[i].isCheck = true;
	      		}
	      		$scope.quanxuan="取消";
           }else{
           	for(var i in $scope.shopRoleList){
	      			$scope.shopRoleList[i].isCheck = false;
	      		}
           	$scope.quanxuan="全选";

           }
	}

	//保存
	$scope.savaData=function(){
		$scope.shopListId=new Array();
		 for(var i in $scope.shopRoleList){
				var isCheck=$scope.shopRoleList[i].isCheck;
				if(isCheck==true){
					$scope.shopRoleListId.push($scope.shopRoleList[i].roleId);
				}
			}
			//console.log($scope.shopRoleListId);
			$http({
					method:'post',
					url:ajaxurl + 'userApp/saveUserAppRoleRel?token=' + $rootScope.token,
					data:{userId:$scope.ownerId,userType:localStorage.getItem("userType"),roleList:$scope.shopRoleListId}
				}).success(function(data){
				//	console.log(data);
				})
	}
		
});