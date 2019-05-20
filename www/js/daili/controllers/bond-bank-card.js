appControllers.controller('daili-bond-bank-card', function($scope,$ionicPopup,$http,my,$interval,$rootScope,$state) {
	$scope.title = '绑定银行卡';
	$scope.btnText="信息确认无误，立即绑定";
	// $scope.contractNumber='18829341517';
	// console.log($scope.contractNumber);
	var verifyCode = new GVerify();
	$scope.formInfo= {
		userName:'',
		tel:'',
		smscode:'',
		bondCard:'',
		reBondCard:'',
		name:'',
		cardAddress:''
	};
	// $scope.formInfo.tel=userBo.contractNumber;
	$scope.formInfo.tel=userBo.contractNumber;
	$scope.formInfo.userName=userBo.userName;
	// console.log(userBo.userName);
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

		// $scope.formInfo.tel=userBo.contractNumber;
		$scope.formInfo.tel=$scope.formInfo.userName.replace(/[^\d]/g, "");

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
								url:ajaxurl+'bind/sendSmsCheckCode?token=' + $rootScope.token,
								//url:'http://192.168.31.50:8080/tms-app-war/baseApp/sendMsgByUserName',
								// params:{phoneNumber:$scope.formInfo.tel,userName:userBo.userName},
								params:{phoneNumber:$scope.formInfo.tel},
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

	//绑定银行卡
	$scope.resetPassword=function(){
		if($scope.formInfo.smscode==''){
			my.alert('请输入验证码');
			return ;
		}
		if($scope.formInfo.bondCard == ''){
			my.alert('请输入银行卡号码');
			return ;
		}else if($scope.formInfo.bondCard.length < 16){
			my.alert('银行卡号码必须大于16位数');
			return ;
		}else if($scope.formInfo.reBondCard != $scope.formInfo.bondCard){
			my.alert('两次银行卡账号不一致');
			return ;
		}
		if($scope.formInfo.name==''){
			my.alert('请输入持卡人姓名');
			return ;
		}
		if($scope.formInfo.cardAddress==''){
			my.alert('请输入开户行地址');
			return ;
		}
		$scope.verifyCode();
	}

	//校验手机号和验证码是否一致  保存新密码
	$scope.verifyCode=function(){
		
		
		$http({
			method:'GET',
			url: ajaxurl+'baseApp/validVerifyCodeAndNumber',
			params:{phoneNumber:$scope.formInfo.tel,verifyCode:$scope.formInfo.smscode}
			// timeout: 5000
		}).success(function(data){
			if(data.status=='000002'){
				my.alert("输入的验证码与手机验证码不一致");
			}else{
				$http({
					method:'POST',
					// url:ajaxurl+'user/bindBankCard?token=' + $rootScope.token,
					url:ajaxurl+'bind/bindBankAccount?token=' + $rootScope.token,
					data:{
						contractNumber:$scope.formInfo.tel,
						validateCodeForLogin:$scope.formInfo.smscode,
						bankAccount:$scope.formInfo.bondCard,
						accountName:$scope.formInfo.name,
						bankAccountInfo:$scope.formInfo.cardAddress,
						userId:userBo.userId
					}
				}).success(function(data){
					my.alert("绑定银行卡成功").then(function() {
						$state.go("withdraws-cash");
					});
				})
			}
		})
	}


});