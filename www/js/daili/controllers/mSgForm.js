appControllers.controller('mSg-form', function($scope,$http,my,$state,$ionicPopup,$rootScope,unicomm_server) {
	
	$scope.hideAccout = true;
	$scope.title = '绑定码上购账号';
	$scope.isCreateAccount = true;
	number_pool = ""

	
	$scope.input = {userName: '', oldpwd: '', newpwd: '', rnewpwd: ''};

	$scope.qrgo2_login = function () {
		unicomm_server.getUnicomm({
			"cmd":"qrgo2_login",
			"userName":$scope.input.userName,
			"password":$scope.input.newpwd,
			"agentName":"agencyId_qrgo_"+$scope.input.userName
		}).then(
			function(return_json){
				console.log(return_json)
				if (return_json.status == '1') {
					$scope.saveForAgency();
				}
				else{
					$scope.qrgo1_login();
				}
			}
		);
	}
	$scope.qrgo1_login = function () {
		unicomm_server.getUnicomm({
			"cmd":"qrgo_login",
			"userName":$scope.input.userName,
			"password":$scope.input.newpwd,
			"agentName":"agencyId_qrgo_"+$scope.input.userName
		}).then(
			function(return_json){
				console.log(return_json)
				if (return_json.status == '1') {
					$scope.saveForAgency();
				}
				else{
					my.alert("码上购登录账号和密码不正确!");
				}
			}
		);
	}

	// 创建账号
	$scope.createAccount = function () {
		if (!$scope.input.userName) {
			my.alert('请填写绑定账号');
		} else if (!$scope.input.newpwd) {
			my.alert('请填写绑定密码');
		}  else {
			$scope.qrgo2_login();
		}
	};

	$scope.saveForAgency = function(){
		$http({
			method: 'post',
			url: ajaxurl + 'nowGoApp/saveForAgency',
			data: {
				userName: $scope.input.userName,
				password: $scope.input.newpwd,
				province: '', // @ Chen chen
				deptCode: deptInfo.deptCode,
				cityCode: shopInfo.shopBo.city,
				token: $rootScope.token
			}
		}).success(function (data) {
			if (data.result === false) {
				my.alert(data.errMsg);
			} else {
				$state.go('mSg-account-list');
			}
		}).error(function () {
			my.alert('数据信息获取失败，请稍后尝试！');
		});
	}

	// 修改密码
	$scope.accountId = localStorage.getItem('mSgFormType');
	$scope.changePwd = function () {
		if (!$scope.input.oldpwd) {
			my.alert('请输入原始密码');
		} else if (!$scope.input.newpwd) {
			my.alert('请设置密码');
		} else if (!$scope.input.rnewpwd) {
			my.alert('请确认密码');
		} else if ($scope.input.newpwd != $scope.input.rnewpwd) {
			my.alert('两次密码不一致！');
		} else if ($scope.input.newpwd.length < 6) {
			my.alert('密码长度必须大于6位');
		}  else {
			_changePwdReqFun($scope.accountId);
		}
	};

	function _changePwdReqFun(e) {
		$http({
			method: 'post',
			url: ajaxurl + 'nowGoApp/modifyPassword',
			data: {
				id: e,
				oldPassword: $scope.input.oldpwd,
				newPassword: $scope.input.newpwd,
				token: $rootScope.token
			}
		}).success(function (data) {
			if (data.status === '0') {
				my.alert(data.msg);
			} else {
				$state.go('mSg-account-list');
			}
		}).error(function () {
			my.alert('数据信息获取失败，请稍后尝试！');
		});
	}
});