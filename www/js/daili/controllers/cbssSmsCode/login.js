appControllers.controller('daili-cbss-smscode-login', function($scope,my,$rootScope,$http,$interval,$state,unicomm_server) {
	var b = new Base64();
	$scope.title = 'CBSS验证码登录';
	$scope.input = {
		 "username":cbssInfo.username
		,"password":b.decode(cbssInfo.password)
		,"smscode":""
		,"orgno":cbssInfo.orgno}
	$scope.vm={data:'获取验证码',resState:false,time:60}; //校验码倒计时

	$scope.getCheckCode = function(){

		$scope.vm.resState = true;

		unicomm_server.getUnicomm({
			 "cmd":"cbss_login_getsmscode"
			,"username":$scope.input["username"]
			,"password":b.encode($scope.input["password"])
			,"orgno":$scope.input["orgno"]
			,"agentName":"agencyId_"+ $scope.input["username"]
		}).then(function(return_json){
			my.alert("请将获取收到的验证码，输入到验证码区")
		});
	
		$interval(
			function(){
				$scope.vm.data = '重新获取'+$scope.vm.time+'s';
				$scope.vm.time--;
				if($scope.vm.time == 0){
					$scope.vm.resState = false;
					$scope.vm.data = '重新获取';
					$scope.vm.time = 60;
				}
			}, 1000, $scope.vm.time
		)
	}
	

	//未修改提交修改
	$scope.changePwd = function(){
		
		unicomm_server.getUnicomm({
			 "cmd":"cbss_login_withsmscode"
			,"username":$scope.input["username"]
			,"smsCode":$scope.input["smscode"]
			,"orgno":$scope.input["orgno"]
			,"agentName":"agencyId_"+ $scope.input["username"]
		}).then(function(return_json){
			if(return_json.status == "1"){
				$http({
					method:'POST',
					url:ajaxurl + 'cbssInfoApp/setIfTestForCbss?token=' + $rootScope.token,
					data:{
						"id":cbssInfo.id,
						"ifTest":"000001"
					}
				})
				my.alert("登录成功!").then(function(){
					$state.go("index_dl")
				})
			}else{
				my.alert(return_json.data)
			}
		})
	};
});