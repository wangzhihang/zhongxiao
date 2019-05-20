appControllers.controller('lock', function($scope, $rootScope,$ionicPopup, $state, $http, unicomm_server, LoginService) {
	$scope.title = "设置手势密码"
//	$scope.txt = "请设置手势密码";
	$scope.pattern = "";
	$scope.lockPatternTips = "请输入手势密码";
	$scope.lockPatternTipsSwitch = true;
	
	var lock = new PatternLock('#lockPattern', {
		// 3
		onDraw:function(pattern){
			// 4
			if ($scope.pattern) {
				// 5
				LoginService.checkLoginPattern(pattern, $scope.pattern).success(function(data) {
					lock.reset();
					LoginService.setLoginPattern(pattern);
					$scope.lockPatternTips = "手势密码设置成功！";
				    $scope.lockPatternTipsSwitch = true;
				    if(userBo.userType == "000003"){
				    	$rootScope.isShowTabs=true;
				    	$state.go('index');
				    }else{
				    	$rootScope.isShowTabs=true;
				    	$state.go('index');
				    	localStorage.setItem('judgeNews',1);
				    }
				    
				}).error(function(data) {
					lock.error();
					$scope.pattern = "";
					lock.reset();
					$scope.lockPatternTips = "两次设置不同!";
					$scope.lockPatternTipsSwitch = true;
					$scope.errorTips = true;
				});
			} else {
				// 6
				lock.reset();
				$scope.pattern = pattern;
				$scope.lockPatternTips = "请再次输入手势密码!";
				$scope.lockPatternTipsSwitch = true;
				$scope.errorTips = false;
				$scope.$apply();
			}
		}
	});

	$scope.delLock = function(){
		$ionicPopup.confirm({
	       title: '系统提示',
	       template: '确定删除或重置手势密码吗？',
	       buttons:[
	        {
		       	text:"取消",
		       	type:"button-stable"
	       	},
	       	{
	       		text:"确认删除",
	       		type:"button-calm",
	       		onTap: function(e) {
	       			$scope.lockPatternTips = "手势密码已删除！";
				    $scope.lockPatternTipsSwitch = true;
				    $scope.errorTips = false;
		     	    LoginService.setLoginPattern("");
		     	    $state.go("userCenter");
		    	}
	       	}
	       ],
	    });
	}
})
