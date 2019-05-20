appControllers.controller('changePassWord', function($scope, $rootScope, $state, $http, $ionicPopup) {
	$scope.title = '修改密码';
	$scope.input = {
		  "oldPwd":""
		, "newPwd":""
		, "repeatPwd":""
	}

	$scope.changePwd = function(){


		if($scope.input.newPwd !="" && $scope.input.newPwd.length >= 6){
			if($scope.input.newPwd == $scope.input.repeatPwd){

				$http({
					method: 'POST',
					url: ajaxurl + "userApp/validatePassword?token=" + $rootScope.token,
					data: {"password":$scope.input.oldPwd}
				}).success(
					function(data){
						if(data){
							$scope.setNewPwd();
						}else{
							$scope.input = {"oldPwd":"", "newPwd":"", "repeatPwd":""}
							$ionicPopup.alert({title: '提示',template: '原密码错误,请重新输入!',okText:'我知道了',okType:'button-calm'});
						}
					}
				).error(function () {
					$ionicPopup.alert({title: '提示',template: '密码验证服务器连接失败,请稍后再试!',okText:'我知道了',okType:'button-calm'});
				});


			}else{
				$ionicPopup.alert({title: '提示',template: '两次密码不同!',okText:'我知道了',okType:'button-calm'});
			}
		}else{
			$ionicPopup.alert({title: '提示',template: '密码至少需要6位!',okText:'我知道了',okType:'button-calm'});
		}
	}

	$scope.setNewPwd = function(){

		$http({
			method: 'POST',
			url: ajaxurl + "userApp/savePassword?token=" + $rootScope.token,
			data: {"password":$scope.input.newPwd}
		}).success(
			function(data){
				if(data){
					$ionicPopup.alert({title: '提示',template: '密码保存成功,请使用新密码登录!',okText:'我知道了',okType:'button-calm'})
					.then(function(){
						$scope.loginOut();
					});
				}else{
					$scope.input = {"oldPwd":"", "newPwd":"", "repeatPwd":""}
					$ionicPopup.alert({title: '提示',template: '新密码保存失败,请稍后再试!',okText:'我知道了',okType:'button-calm'});
				}
			}
		).error(function () {
			$ionicPopup.alert({title: '提示',template: '密码验证服务器连接失败,请稍后再试!',okText:'我知道了',okType:'button-calm'});
		});
	}

	$scope.loginOut = function(){

		$rootScope.token = "";
		$http({
			method: 'POST',
			url: ajaxurl + "userApp/loginOut?token=" + $rootScope.token
		}).success(function(data){
			$state.go("login");
		}).error(function () {
			$state.go("login");
		});
	}
})
