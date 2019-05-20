appControllers.controller('agencyInfo', function($scope, $http, $rootScope, my)
{
	$scope.title = '发展人信息';
	$scope.current = "2";
	$scope.setCurrent = function (param) {
		$scope.current = param;
	};

	// 业务员和店铺不让设置默认
	$scope.setDefault = !(userBo.userType=='000003'||userBo.userType=='000005');

	
	//获取发展人列表[BSS/CBSS]
	$scope.bssAgencyList = [];
	$scope.cbssAgencyList = [];

	//初始化数据
	$http({
		method:'GET',
		url:ajaxurl + 'userApp/queryAgentListByShopId?token=' + $rootScope.token,
	}).success(function(data){

		$scope.bssAgencyList = data["bssInfo"];
		$scope.cbssAgencyList = (isEmptyObject(data['defaultCbss'])?[]:[data['defaultCbss']]).concat(data["cbssInfo"]);
	}).error(function () {
		my.alert("获取发展人列表出错!");
	});


	$scope.cbbsSetDefault = function(index){
		if($scope.cbssAgencyList[index].defaultTag != '1'){
			$http({
				method:'GET',
				url:ajaxurl + 'cbssInfoApp/setDefaultCbssInfo?token=' + $rootScope.token,
				params:{"cbssInfoId":$scope.cbssAgencyList[index].id}
			}).success(function(data){
				if(data){
					for(var i in $scope.cbssAgencyList){
						$scope.cbssAgencyList[i].defaultTag = 0;
					}
					$scope.cbssAgencyList[index].defaultTag = 1;
					cbssInfo = {
						"username": $scope.cbssAgencyList[index].userName,
						"password": $scope.cbssAgencyList[index].password,
						"orgno": 	  $scope.cbssAgencyList[index].province,
					}
				}else{
					my.alert("设置默认发展人失败，请稍后重试!");
				}
			}).error(function(){
				my.alert("设置默认发展人失败，请稍后重试!");
			});
		}
	};


	$scope.bbsSetDefault = function(index){
		if($scope.bssAgencyList[index].defaultTag != '1'){
			$http({
				method:'GET',
				url:ajaxurl + 'bssInfoApp/setDefaultBssInfo?token=' + $rootScope.token,
				params:{"bssInfoId":$scope.bssAgencyList[index].id}
			}).success(function(data){
				if(data){
					for(var i in $scope.bssAgencyList){
						$scope.bssAgencyList[i].defaultTag = 0;
					}
					$scope.bssAgencyList[index].defaultTag = 1;
					bssInfo = {
						"vpnName": "",
						"vpnPwd":  "",
						"userName":$scope.bssAgencyList[index].userName,
						"password":$scope.bssAgencyList[index].password,
						"developCode":$scope.bssAgencyList[index].developCode,
						"developName":$scope.bssAgencyList[index].developName == null ? "" : $scope.bssAgencyList[index].developName,
						"channelCode": $scope.bssAgencyList[index].channelCode,
						"channelName":$scope.bssAgencyList[index].channelName == null ? "" : $scope.bssAgencyList[index].channelName,
					}
				}else{
					my.alert("设置默认发展人失败，请稍后重试!");
				}
			}).error(function(){
				my.alert("设置默认发展人失败，请稍后重试!");
			});
		}
	};
});