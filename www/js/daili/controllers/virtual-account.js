appControllers.controller('daili-virtual-account', function($scope,$http,$rootScope,$state,my) {
	$scope.title = '虚拟走账';
	//是否能充值
	if(userBo.userType == '000002'){
		$scope.allowRecharge = true;
	}
	if(signInInfo.deptMap.deptType == '000001'){
		$scope.levelCode = signInInfo.deptInfo.levelCode.substring(0,7);
	}else{
		$scope.levelCode = signInInfo.deptInfo.levelCode;
	}
	// $scope.allowRecharge = false;
	$scope.getDate = function(keywords){
		$http({
			method:'post',
			url:ajaxurl + 'userApp/queryUserAccount?token=' + $rootScope.token,
			data:{
				levelCode:$scope.levelCode,
				keywords:keywords
			}
		}).success(function(data){
			$scope.userAccountList = data.users;
			for(var i in $scope.userAccountList){
				if($scope.userAccountList[i].testTag == '000001' && $scope.userAccountList[i].isVirtual == '000002'){
					$scope.userAccountList[i].allowRecharge = true;
				}
				if($scope.userAccountList[i].userType == '000002'){
					$scope.userAccountList[i].userType = '代理商';
					$scope.userAccountList[i].allowRecharge = false;
					// console.log('111111111'+$scope.userAccountList[i].allowRecharge);
				}else if($scope.userAccountList[i].userType == '000003'){
					$scope.userAccountList[i].userType = '业务员';
				}else if($scope.userAccountList[i].userType == '000005'){
					$scope.userAccountList[i].userType = '店铺';
				}
			}
		})
	}
	$scope.getDate('');
	//关键字搜索
	$scope.lookKeywords = function(keyword){
		$scope.getDate(keyword);
	}
	//充值
	$scope.goRecharge = function(userId,amount){
		localStorage.setItem('virtualAmount',amount);
		$state.go('daili-virtual-recharge',{'userId':userId});
	}

});