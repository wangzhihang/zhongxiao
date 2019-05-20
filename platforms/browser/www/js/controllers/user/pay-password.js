appControllers.controller('payPassWord', function($scope,$interval,$ionicLoading,$timeout,$ionicPopup,$state) {
	$scope.title = '支付密码';
	$scope.input = {"tel":"","checkCode":"","newPwd":"","rNewPwd":""};
	//获取校验码倒计时
	 $scope.vm={
        data:'获取验证码',
        resState:false,
        time:60
    };
    $scope.getCheckCode = function(){
    	if($scope.input.tel == ""){
    		$ionicLoading.show({"template":'请先输入手机号码'});
    		$timeout(function () {$ionicLoading.hide();}, 1500);
    	}else{
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
    };
    $scope.changePwd = function(){
    	if($scope.input.tel == ''){
    		$ionicLoading.show({"template":'请输入手机号码'});
    		$timeout(function () {$ionicLoading.hide();}, 1500);
    	}else if($scope.input.checkCode == ''){
    		$ionicLoading.show({"template":'请输入短信校验码'});
    		$timeout(function () {$ionicLoading.hide();}, 1500);
    	}else if($scope.input.newPwd == ''){
    		$ionicLoading.show({"template":'请输入支付密码'});
    		$timeout(function () {$ionicLoading.hide();}, 1500);
    	}else if($scope.input.rNewPwd == ''){
    		$ionicLoading.show({"template":'请再次输入支付密码'});
    		$timeout(function () {$ionicLoading.hide();}, 1500);
    	}else{
    		var alertPopup = $ionicPopup.alert({
		       title: '系统提示',
		       template: '支付密码修改成功！',
		       okText:'完成',
		       okType:'button-calm'
		    });
		    alertPopup.then(function(res) {
		       $state.go('securityCenter');
		    });
    	}
    };
})
