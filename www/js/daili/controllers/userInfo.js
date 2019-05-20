appControllers.controller('user-info', function($scope,$http,$rootScope,$timeout,$ionicLoading) {
	$scope.title = '个人信息';
	$scope.btnState = '修改信息';
	$scope.editVal = false;
	$scope.showData = true;
	// $scope.data = {
	// 	userName:signInInfo.userInfo['userName'],
	// 	realName:signInInfo.userInfo['realName'],
	// 	contractNumber:signInInfo.userInfo['contractNumber'],
	// 	weixinNo:signInInfo.userInfo['weixinNo'],
	// 	qq:signInInfo.userInfo['qq'],
	// 	address:signInInfo.userInfo['address']
	// };
	$http({
		method:"get",
		url: ajaxurl + "userApp/findUser?token=" + $rootScope.token
	}).success(function(data){
		$scope.data = data;
	}).error(function () {
         my.alert('数据信息获取失败！请稍后尝试。').then(function(){
            $state.go('index_dl');
        }); 
    });

	//修改/保存
	$scope.updata = function(){
		//console.log($scope.data.userName);
		if($scope.btnState == '保存信息'){
			$http({
				method:"post",
				url: ajaxurl + "userApp/saveUser?token=" + $rootScope.token,
				params: {"weixinNo":$scope.data.weixinNo,"qq":$scope.data.qq,"address":$scope.data.address,"realName":$scope.data.realName,"contractNumber":$scope.data.contractNumber}
			}).success(function(data){
				if(data == true){
					$scope.editVal=false;
					$scope.showData=true;
					$ionicLoading.show({"template":'用户信息更新成功！'});
			    	$timeout(function () {
			    		$ionicLoading.hide();
			    		$scope.btnState = '修改信息';
			    	}, 1500);
				}
			});
		}else{
			$scope.btnState = '保存信息';
			$scope.editVal=true;
			$scope.showData=false;		
		}
	};
});