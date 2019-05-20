appControllers.controller('change-bss-pwd', function($scope,my,$rootScope,$stateParams,$interval,$http,$state, $ionicLoading, unicomm_server) {
	$scope.title = 'BSS密码修改';
	$scope.input = {
		userName:localStorage.getItem('userName'),
		developName:localStorage.getItem('developName'),
		developPhone:localStorage.getItem('developPhone'),
		smscode:"",
		oldpwd:"",
		newpwd:"",
		rnewpwd:""
	};
	//切换
	$scope.tag = {
		current: "0"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
			$scope.hideChangePwdBtn = true;
		}
	};
	
	//获取校验码倒计时
	 $scope.vm={
		data:'获取验证码',
		resState:false,
		time:60
	};
	//console.log(signInInfo.cbssCode);
	$scope.getCheckCode = function(){
		//联通系统登录
		var b = new Base64();
		// console.log("======"+b.encode($scope.input.oldpwd)  +"======="+localStorage.getItem('password'))
	unicomm_server.bssLogin({username:localStorage.getItem('userName'),password:b.encode(localStorage.getItem('password') )})
	.then(function(){
		//console.log('登录成功');
		if($scope.from()){
			//获取smsCode
			unicomm_server.getUnicomm({
				  "cmd":"bss_pwd_updatepwd"
				, "oldpwd":$scope.input["oldpwd"]
				, "newpwd":$scope.input["newpwd"]
				, "smscode":$scope.input["smscode"]
			}).then(function(return_json){
				console.log(JSON.stringify(return_json))
			}, function() {
				//...
			});

			$scope.vm.resState = true;
			$interval(function(){
				$scope.vm.data = '重新获取'+$scope.vm.time+'s';
				$scope.vm.time--;
				if($scope.vm.time == 0){
					$scope.vm.resState = false;
					$scope.vm.data = '重新获取';
					$scope.vm.time = 60;
				}
			},1000,$scope.vm.time)
		}else{
		}
	},function(){
		//my.alert("登录失败,请联系管理员!");
	});
		
	};
	
	//原始密码核验
	$scope.checkOldpwd = function(){
		// var b = new Base64();
		// console.log("======"+b.encode($scope.input.oldpwd)  +"======="+localStorage.getItem('password'))
		if($scope.input.oldpwd == localStorage.getItem('password')){
			$scope.oldpwdTips = false;
		}else{
			$scope.oldpwdTips = true;
		}
	}
	//已修改提交修改
	$scope.changePwded = function(){
		if($scope.from()){
			$http({
				method:'POST',
				url:ajaxurl + 'bssInfoApp/modifyBssPassword?token=' + $rootScope.token,
				data:{"oldPassword":$scope.input["oldpwd"],"newPassword":$scope.input["newpwd"],"bssId":localStorage.getItem('id')}
			}).success(function(data){
				if(data == "1"){
					my.alert('密码修改成功').then(function(){
						$state.go('bss-account-list');
					});
				}else{
					my.alert('密码修改失败');
					$state.go('bss-account-list');
				}
			});
		}
	};
	//未修改提交修改
	$scope.changePwd = function(){
		//console.log($scope.modifyurl);
		console.log($scope.input["newpwd"]+'=='+$scope.input["oldpwd"]);
		// if($scope.from()){
		// 	if($scope.input.smscode.length < 6){
		// 		$ionicLoading.show({"template":'请输入短信校验码', "duration":1500});
		// 		return false;
		// 	}

		// 	unicomm_server.getUnicomm({
		// 		  "cmd":"bss_pwd_updatepwd"
		// 		, "oldpwd":$scope.input["oldpwd"]
		// 		, "newpwd":$scope.input["newpwd"]
		// 		, "smscode":$scope.input["smscode"]
		// 	}).then(function(return_json){
		// 		if(return_json.status == "1"){
		// 			$http({
		// 	method:'POST',
		// 	url:ajaxurl + 'bssInfoApp/modifyBssPassword?token=' + $rootScope.token,
		// 	data:{"newPassword":$scope.input["newpwd"],"bssId":localStorage.getItem('id')}
		// }).success(function(data){
		// 	if(data == "1"){
		// 		my.alert('密码修改成功').then(function(){
		// 			$state.go('bss-account-list');
		// 		});
		// 	}else{
		// 		my.alert('密码修改失败');
		// 		$state.go('bss-account-list');
		// 	}
		// });
		// 		}else{
		// 			my.alert(return_json.data);
		// 		}
		// 	}, function() {
		// 		// bss获取号码出错
		// 	})
		// }
	};
	
	//已修改密码验证
	$scope.from = function(){
		if($scope.input.oldpwd == ""){
			$ionicLoading.show({"template":'请输入原始密码', "duration":1500});
			return false;
		}
		if($scope.input.newpwd == ""){
			$ionicLoading.show({"template":'请输入新密码', "duration":1500});
			return false;
		}
		if($scope.input.newpwd.length<8){
			$ionicLoading.show({"template":'请至少输入8位的新密码', "duration":1500});
			return false;
		}
		if($scope.input.rnewpwd == ""){
			$ionicLoading.show({"template":'请确认新密码', "duration":1500});
			return false;
		}
		if($scope.input.newpwd != $scope.input.rnewpwd){
			$ionicLoading.show({"template":'两次输入的新密码不相同', "duration":1500});
			return false;
		}

		return true;
	}	
});