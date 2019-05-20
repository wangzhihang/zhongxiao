//登录CBSS账号
appControllers.controller('add-cbss-account', function($scope,$state,$interval,unicomm_server,my) {
	$scope.title = '添加CBSS工号';
	$scope.btnTxt = '用户身份校验';
	$scope.resState = true;
	$scope.vm={
		data:'获取验证码',
		resState:false,
		time:180
	};
	$scope.showVertifyCode = false;
	$scope.data = {cbssAccount:'',cbssPwd:'',smscode:'',orgno:signInInfo.cbssCode,checked:false};
	$scope.checkChange = function(){
		console.log('11==='+$scope.data.checked);
		if($scope.data.checked == true){
			$scope.showVertifyCode = true;
		}else{
			$scope.showVertifyCode = false;
		}
	}
	//基础核验
	var b = new Base64();
	$scope.check = function(){
		if($scope.data.cbssAccount == ''
		|| $scope.data.cbssPwd == ''){
			$scope.resState = true;
		}else{
			$scope.resState = false;
		}
	}

	//登录CBSS
	$scope.signInCbss = function(){
		$scope.btnTxt = '正在登录CBSS';
		$scope.resState = true;
		$scope.loading = true;
		//登录CBSS
		if($scope.showVertifyCode){
			$scope.cbss_login_withsmscode();
		}else{
			$scope.cbssLogin()
		}
	}
	
	
	$scope.cbssLogin = function(){
		cbssInfo = {};
		unicomm_server.cbssLogin({username:$scope.data.cbssAccount,password:b.encode($scope.data.cbssPwd),orgno:$scope.data.orgno})
		.then(function(){
			$scope.btnTxt = '用户身份校验';
			$scope.resState = false;
			$scope.loading = false;
			//保存账号密码（提交时使用）
			localStorage.setItem('cbssUserName',$scope.data.cbssAccount);
			localStorage.setItem('cbssUserPwd',$scope.data.cbssPwd);
			localStorage.setItem('ifTest',"000002");
			$state.go('search-cbss-developer');
		},function(){
			$scope.resState = false;
			$scope.loading = false;
			$scope.btnTxt = '用户身份校验';
		});
	}


	$scope.getCheckCode = function(){

		
		$scope.vm.resState = true;
		unicomm_server.getUnicomm({
			"cmd":"cbss_login_getsmscode",
			"username":$scope.data["cbssAccount"],
			"password":b.encode($scope.data["cbssPwd"]),
			"orgno":$scope.data["orgno"],
			"agentName":"agencyId_cbss_"+ $scope.data["cbssAccount"]
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
					$scope.vm.time = 180;
				}
			}, 1000, $scope.vm.time
		)
	}
	

	//未修改提交修改
	$scope.cbss_login_withsmscode = function(){
		
		unicomm_server.getUnicomm({
			"cmd":"cbss_login_withsmscode",
			"username":$scope.data["cbssAccount"],
			"smsCode":$scope.data["smscode"],
			"orgno":$scope.data["orgno"],
			"agentName":"agencyId_cbss_"+ $scope.data["cbssAccount"]
		}).then(function(return_json){
			if(return_json.status == "1"){
				my.alert("登录成功!").then(function(){
					localStorage.setItem('cbssUserName',$scope.data.cbssAccount);
					localStorage.setItem('cbssUserPwd',$scope.data.cbssPwd);
					localStorage.setItem('ifTest',"000001");
					$state.go('search-cbss-developer');
				})
			}else{
				my.alert(return_json.data)
			}
		})
	};
});
//CBSS发展人查询
appControllers.controller('search-cbss-developer', function($scope,$state,unicomm_server,my) {
	$scope.title = '查询CBSS发展人';
	$scope.resState = true;
	$scope.btnTxt = '查询发展人';
	$scope.data = {keyWords:''};
	//console.log(localStorage.getItem('cbssUserPwd'));
	//关键词不能为空
	$scope.changeBtn = function(){
		if($scope.data.keyWords == ''){
			$scope.resState = true;
		}else{
			$scope.resState = false;
		}
	}
	//查询发展人信息
	$scope.query = function(){
		$scope.btnTxt = '正在查询';
		$scope.loading = true;
		$scope.resState = true;
		var unicomm_json = {
			cmd:"querydeveloppeople"
			,staffname:$scope.data.keyWords
			,developcode:''
		}
		if(localStorage.getItem('ifTest') ==  "000001"){
			unicomm_json.agentName = "agencyId_cbss_"+ localStorage.getItem('cbssUserName')
		}
		unicomm_server.getUnicomm(unicomm_json).then(
			function(return_json){
				$scope.btnTxt = '查询发展人';
				$scope.loading = false;
				$scope.resState = false;
				if (return_json.status == '1') {
					localStorage.setItem('cbssDevelopersList',JSON.stringify(return_json));
					$("<table>" + return_json.data + "</table>").find('tr').each(function(index, el) {
						if($.trim($(this).find('td').eq(2).text()) == ''){
							my.alert('对不起，没有查到发展人信息，请重新输入关键词！');
						}else{
							$state.go("cbss-developers-list");
						}
					});
				}else{
					my.alert('接口服务器无返回信息!');
				}
			},
			function () {
				$scope.btnTxt = '查询发展人';
				$scope.loading = false;
				$scope.resState = false;
				my.alert('接口服务器无返回信息!');
			}
		)
	}
})