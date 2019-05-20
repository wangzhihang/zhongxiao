appControllers.controller('sign-in', function(my,$scope, $rootScope, $ionicLoading,$state, $http,LoginService) {
	$scope.title =  appName + "登录";
	$scope.version = version;
	$scope.signInTxt = '立即登录';
	$scope.lockPatternTips = "请输入手势密码";
	$scope.resState = true;
	$scope.loading = false;
	$scope.lockPatternTipsSwitch = true;
	$scope.data={"userName":"","password":"","login_pattern":""};
	var lock = null;
	//登录方式切换
	$scope.tag = {
		current: "1"
	};
	$scope.actions = {
		setCurrent: function (param) {
			$scope.tag.current = param;
		}
	};
	//按钮状态
	$scope.changeBtn = function(){
		$scope.data.userName = $scope.data.userName.toLowerCase().replace(/[^a-z0-9]/g, "");
		if($scope.data.userName === '' || $scope.data.password === ''){
			$scope.resState = true;
		}else{
			$scope.resState = false;
		}
	};
	
	
	// 版本判断
	$ionicLoading.show({
		noBackdrop:true,
		template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner><p class="cen light">版本检测中</p>'
    });
	$http({
		method: 'GET',
		url: ajaxurl + 'appVersion/checkAppVersion',
		params: {"name":versionName, "version":version}
	}).success(function(return_json){
		//console.log(return_json.result);
		if(return_json.result == "1"){
			$ionicLoading.hide();
			$scope.patternBox(); 
		}else{
			$ionicLoading.show({
				noBackdrop:true,
				template: '<ion-spinner icon="ripple" class="spinner-light"></ion-spinner><p class="cen light">版本更新中<br /><span class="f-12 light">请等待十到二十秒，如长时间无反应，请重新下载!</span></p>'
		    });
		 //    $ionicLoading.hide();
			// $scope.patternBox(); 
		}
	});
	// 手势解锁 显示状态
	$scope.patternBox = function(){

		$scope.loginHistory = localStorage.getItem("signIn");
		if($scope.loginHistory != null){
			$scope.loginHistory = JSON.parse($scope.loginHistory);
			if($scope.loginHistory.login_pattern){
				$scope.tag = {
					current: "2"
				};
				$scope.noSetLockPattern = true;
				lock = new PatternLock('#lockPattern_login', {
					onDraw:function(pattern){
						LoginService.checkLoginPattern(pattern).success(function(data) {
							//lock.reset();
							$scope.data = $scope.loginHistory;
							// 登录前状态
							$scope.errorTips = false;
							$scope.lockPatternTips = "密码正确，正在登录...";
							$scope.signIn();
						}).error(function(data) {
							lock.error();
							lock.reset();
							$scope.lockPatternTips = "手势密码错误，请重新输入！";
							$scope.lockPatternTipsSwitch = true;
							$scope.errorTips = true;
						});
					}
				});

			}else{
				$scope.tag = {
					current: "1"
				};
				$scope.noSetLockPattern = false;
			}
		}else{
			$scope.loginHistory = {};
			$scope.tag = {
				current: "1"
			};
			$scope.noSetLockPattern = false;
		}
	};	
	//开始登录
	$scope.signIn = function(){
		$scope.resState = true;
		$scope.loading = true;
		$scope.signInTxt = '正在登录';
		$http({
			method:'post',
			url:ajaxurl + 'userApp/agencyLogin',
			data:{userName:$scope.data.userName,password:$scope.data.password}
		}).success(function(data){
			//console.log(JSON.stringify(data));
			if(data.result == 'success'){				
				localStorage.setItem('signIn',JSON.stringify({
					"userName":$scope.data.userName,
					"password":$scope.data.password,
					"login_pattern":$scope.data.login_pattern
				}));
				signInInfo = data;
				//测试版预先存储下来
				localStorage.setItem('signInInfo',JSON.stringify(signInInfo));
				// $scope.userType=data.userType;
				// if($scope.userType == "agency"){
				// 	$scope.title =  appName + "登录";
				// }else{
				// 	$scope.title = appYwName + "登录";
				// }
				localStorage.setItem('userId',JSON.stringify(data.userInfo.userId));
			
				if($scope.loginHistory.login_pattern == undefined || $scope.loginHistory.login_pattern == ""){
					my.confirm("设置滑动手势，代替输入密码","便捷登录设置","去设置","不了").then(function(){
						$state.go("lock");
					},function(){
						$state.go("index");
					});
				}else{
					$state.go("index");
				}
				
			}else{
				$scope.errorTips = true;
				$scope.lockPatternTips = data.msg;
				my.alert(data.msg).then(function(){
					$scope.signInTxt = '立即登录';
					$scope.resState = false;
					$scope.loading = false;
				});
			}
		}).error(function(){
			my.alert('登录连接服务器无返回信息!').then(function(){
				$scope.signInTxt = '立即登录';
				$scope.resState = false;
				$scope.loading = false;
			});
		});
	};
	
});
