appControllers.controller('mSg-developers-list', function($scope,$http,my,$state,$ionicPopup,$rootScope,unicomm_server,my) {
	$scope.title = '选择发展人';
	$scope.resState = true;
	$scope.getSelectedVal = '';
	qrgoInfo = {};
	$scope.v = "";
	$scope.loading = false;


	$scope.qrgo1_login = function(){
		unicomm_server.getUnicomm({
			"cmd":"qrgo_login",
			"userName":qrgoInfo.userName,
			"password":qrgoInfo.password
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.v = "";
					$scope.devId = return_json.data.devId
					$scope.getdevelopersList();
				}else{
					my.alert("登录失败!");
				}
			}
		)
	}


	
	$scope.qrgo_login = function(){
		unicomm_server.getUnicomm({
			"cmd":"qrgo2_login",
			"userName":qrgoInfo.userName,
			"password":qrgoInfo.password
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					$scope.v = 2;
					number_pool = "QRGO2"
					$scope.devId = return_json.data.devId
					$scope.getdevelopersList();
				}else{
					$scope.qrgo1_login();
				}
			}
		)
	}

	$scope.developersList = [];
	$scope.getdevelopersList = function(){
		unicomm_server.getUnicomm({
			"cmd":"qrgo"+$scope.v+"_queryDevelopList"
		}).then(
			function(return_json){
				if (return_json.status == '1') {
					for(var i in return_json.data){
						var data = return_json.data[i];
						if(data.id == qrgoInfo.devId){
							data.show = true;
						}
						$scope.developersList.push(data);
					}
					$scope.loading = true;
				}else{
					my.alert("获取发展人列表失败!");
				}
			}
		)
	}

	$http({
		method : "GET",
		url : ajaxurl + "nowGoApp/getDefaultByShopId?token=" + $rootScope.token
	}).success(function(data){

		if(data.userInfo){
			if(data.userInfo.userName && data.userInfo.password){
				qrgoInfo.userName = data.userInfo.userName;
				qrgoInfo.password = data.userInfo.password;
				$scope.qrgo_login();
			}else{
				my.alert("请联系您的上级代理商绑定码上购账号。");
			}
		}else{
			my.alert("请联系您的上级代理商绑定码上购账号。");
		}
	}).error(function(){
		my.alert("获取码上购账号失败。");
	});



	// mock data

	// select developer
	$scope._select = function (index) {
		$scope.devId  = $scope.developersList[index].id;
		$scope.getSelectedVal  = $scope.developersList[index].id; // get ID
		$scope.resState = false;
	};
	// confirm
	$scope._ok = function () {
		$scope.resState = true;
		unicomm_server.getUnicomm({
			"cmd":"qrgo"+$scope.v+"_bindDevelopInfo"
			,"targetDevelop":$scope.getSelectedVal
		}).then(
			function(return_json){
				$scope.resState = false;
				number_pool = "";
				if (return_json.status == '1') {
					my.alert('设置默认发展人成功!').then(function(){
						$state.go("mSg-account-list");
					});
				}else{
					my.alert("设置默认发展人失败!");
				}
			}
		)
		
	}
});