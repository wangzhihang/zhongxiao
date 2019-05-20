appControllers.controller('change-cbss-pwd', function($scope,my,$stateParams,$rootScope,$http,$interval,$state, $ionicLoading, unicomm_server) {
	$scope.title = 'CBSS密码修改';
	$scope.modifyurl = '';
	$scope.input = {
		userName:localStorage.getItem('userName'),
		developName:localStorage.getItem('developName'),
		bindPhone:"",
		realName:"",
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
	//获取用户姓名
	$scope.getRealName = function(){
		localStorage.setItem('cbssStaffName',$scope.input.realName);
	}
	if(localStorage.getItem('staffName') == null){
		$scope.input.realName = localStorage.getItem('staffName');
	}else if(localStorage.getItem('cbssStaffName') == null){
		$scope.getRealName();
	}else{
		$scope.input.realName = localStorage.getItem('cbssStaffName');
	}
	//获取用户手机号
	$scope.getBindPhone = function(){
		localStorage.setItem('cbssbindPhone',$scope.input.bindPhone);
	}
	if(localStorage.getItem('cbssbindPhone')){
		$scope.input.bindPhone = localStorage.getItem('cbssbindPhone');
	}else if(localStorage.getItem('developPhone')){
		$scope.input.bindPhone = localStorage.getItem('developPhone');
	}
	
	// console.log("$rootScope.token  "+$rootScope.token);
	//获取校验码倒计时
	 $scope.vm={
		data:'获取验证码',
		resState:false,
		time:60
	};
	$scope.getCheckCode = function(){
		//联通系统登录
	 unicomm_server.cbssLogin({username:localStorage.getItem('userName'),password:localStorage.getItem('password'),orgno:signInInfo.cbssCode})
	 .then(function(){
	 	//console.log('登录成功');
	 	if($scope.from()){
			//获取smsCode
			unicomm_server.getUnicomm({
				  "cmd":"cbss_pwd_getsmscode"
				, "oldpwd":$scope.input["oldpwd"]
				, "mobilephone":$scope.input["bindPhone"]
				, "name":$scope.input["realName"]
			}).then(function(return_json){
				//console.log(JSON.stringify(return_json))
				$scope.modifyurl = return_json.data;
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
		var b = new Base64();
		//console.log("123  "+b.encode($scope.input.oldpwd)  +"909  "+localStorage.getItem('password'));
		if(b.encode($scope.input.oldpwd) == localStorage.getItem('password')){
			$scope.oldpwdTips = false;
		}else{
			$scope.oldpwdTips = true;
		}
	}
	//已修改提交修改
	$scope.changePwded= function(){
		if($scope.from()){
			$http({
			method:'POST',
			url:ajaxurl + 'cbssInfoApp/modifyCbssPassword?token=' + $rootScope.token,
			data:{"oldPassword":$scope.input["oldpwd"],"newPassword":$scope.input["newpwd"],"cbssId":localStorage.getItem('id')}
		}).success(function(data){
			if(data == "1"){
				my.alert('密码修改成功').then(function(){
					$state.go('cbss-account-list');
				});
			}else{
				my.alert('密码修改失败');
				$state.go('cbss-account-list');
			}
		});
		}
		
	};
	//未修改提交修改
	$scope.changePwd = function(){
		//console.log($scope.modifyurl);
		if($scope.from()){
			if($scope.input.realName == ""){
			$ionicLoading.show({"template":'请输入员工姓名', "duration":1500});
			return false;
		}
			if($scope.input.smscode.length < 6){
				$ionicLoading.show({"template":'请输入短信校验码', "duration":1500});
				return false;
			}

			unicomm_server.getUnicomm({
				  "cmd":"cbss_pwd_modify"
				, "oldpwd":$scope.input["oldpwd"]
				, "newpwd":$scope.input["newpwd"]
				, "name":$scope.input["realName"]
				, "mobilephone":$scope.input["bindPhone"]
				, "modifyurl":$scope.modifyurl
				, "smscode":$scope.input["smscode"]
			}).then(function(return_json){
				if(return_json.status == "1"){
					$http({
						method:'POST',
						url:ajaxurl + 'cbssInfoApp/modifyCbssPassword?token=' + $rootScope.token,
						data:{"newPassword":$scope.input["newpwd"],"cbssId":localStorage.getItem('id')}
					}).success(function(data){
						if(data == "1"){
							my.alert('密码修改成功').then(function(){
								$state.go('cbss-account-list');
							});
						}else{
							my.alert('密码修改失败');
						}
					});
				}else{
					my.alert(return_json.data);
				}
			}, function() {
				// bss获取号码出错
			})
		}
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