appControllers.controller('reset-password', function($scope,my,$state,$ionicModal,$http,$interval,$ionicPopup) {
	$scope.title = '设置密码';
	$scope.btnText="设置密码";
	var verifyCode = new GVerify();
	$scope.formInfo= {
		userName:'',
		tel:'',
		smscode:'',
		password:'',
		repassword:''
	};
	
	$scope.getGVerify = function(){
		$scope.GVerifyDate = verifyCode.refresh();
	}
	$scope.getGVerify();

	$scope.vm={
		data:'获取验证码',
		resState:false,
		time:60
	};
	$scope.ispicVerifiyCode=false;
	$scope.resState=true;
	//获取验证码
	$scope.getCheckCode=function(){
		if($scope.formInfo.userName.substring(0,1)=='a'||$scope.formInfo.userName.substring(0,1)=='b'||$scope.formInfo.userName.substring(0,1)=='c'){
			$scope.formInfo.tel=$scope.formInfo.userName.substring(1,12).replace(/[^\d]/g, "");
		}else{
			$scope.formInfo.tel=$scope.formInfo.userName.replace(/[^\d]/g, "");
		}
		// console.log($scope.formInfo.tel);
		if($scope.formInfo.tel.length != 11){
			my.alert('请输入正确的登录账号（a或者c加上手机号码），如有异常：请致电029-86262222');
			return ;
		}

		$scope.ispicVerifiyCode=true;
		$scope.vm.data = '获取验证码';
		$scope.input = {"GVerify":""};
		
		var temp = '<div class="childerVer txtCenter">'+
						'<img src="{{GVerifyDate.img}}" class="mb-10" style="width:150px;height:45px;" ng-click="getGVerify()">'+
						'<input type="text" ng-model="input.GVerify" id="code_input" class="codeInput txtCenter" value="" placeholder="请输入验证码" style="margin: 0 auto;"/>'+
					'</div>';
		$scope.getGVerify();
		$ionicPopup.show({
			template: temp,
			title: '图片验证码',
			//subTitle: '输入图片验证码',
			scope: $scope,
			buttons: [
			   { text: '取消' },
			   {
					text: '验证',
					type: 'button-calm',
					onTap: function(e) {
						if($scope.input.GVerify.toLowerCase() == $scope.GVerifyDate.code.toLowerCase()){
							$http({
								method:'GET',
								url:ajaxurl + 'baseApp/sendMsgByUserName',
								//url:'http://192.168.31.50:8080/tms-app-war/baseApp/sendMsgByUserName',
								params:{phoneNumber:$scope.formInfo.tel,userName:$scope.formInfo.userName},
								timeout: 5000
							}).success(function(data){
								console.log(data);
								if(data.status=='000002'){
									layer.open({
									    content: '该用户不存在'
									    ,skin: 'msg'
									    ,time: 4 //2秒后自动关闭
									 });
									$scope.formInfo.userName='';
								}else{
									layer.open({
									    content: '短信验证码已发送，请使用手机（用户名里的电话）查看短信验证码'
									    ,skin: 'msg'
									    ,time: 4 //4秒后自动关闭
									  });
									$scope.resState=false;
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
								}
								
							});
						}else{
							/*my.alert("验证码错误").then(function(){
								$scope.getGVerify();
							})*/
							$scope.input.GVerify='';
							layer.open({
							    content: '验证码错误'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							  });
							$scope.getGVerify();
							e.preventDefault();
						}
					}
			   }
			]
		});
	}


	//重置密码
	$scope.resetPassword=function(){
		if($scope.formInfo.userName==''){
			my.alert('请输入需要找回密码的用户名');
			return ;
		}
		if($scope.formInfo.smscode==''){
			my.alert('请输入验证码');
			return ;
		}
		if($scope.formInfo.password == ''){
			my.alert('请设置密码');
			return ;
		}else if($scope.formInfo.password.length < 6){
			my.alert('密码必须大于6位数');
			return ;
		}else if($scope.formInfo.repassword != $scope.formInfo.password){
			my.alert('两次密码不一致');
			return ;
		}
		$scope.verifyCode();
	}

	//校验手机号和验证码是否一致  保存新密码
	$scope.verifyCode=function(){
		$http({
			method:'GET',
			url:ajaxurl + 'baseApp/validVerifyCodeAndNumber',
			params:{phoneNumber:$scope.formInfo.tel,verifyCode:$scope.formInfo.smscode},
			timeout: 5000
		}).success(function(data){
			if(data.status=='000002'){
				my.alert("输入的验证码与手机验证码不一致");
			}else{
				$http({
					method:'POST',
					url:ajaxurl + 'baseApp/saveNewPassword',
					data:{userName:$scope.formInfo.userName,secondPassword:$scope.formInfo.password},
					timeout: 5000
				}).success(function(data){
					my.alert("密码重置成功").then(function() {
						$state.go("login");
					});
				})
			}
		})
	}
})
