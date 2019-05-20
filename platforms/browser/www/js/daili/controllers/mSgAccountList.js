appControllers.controller('mSg-account-list', function($scope,$http,my,$state,$ionicPopup,$rootScope) {
	$scope.title = '码上购账号';
	$scope.userList = [];
	$scope.data = {account: '', password: '', oldPassword: '', newPassword: ''};
	$scope.userListLength = null;
	$scope.tag = null;
	// init
	getAccount()
	// Get account...
	function getAccount() {
		$scope.loading = true;
		$http({
			method: 'get',
			url: ajaxurl + 'nowGoApp/findAll',
			params: {token: $rootScope.token}
		}).success(function (data) {
			$scope.loading = false;
			$scope.userList = data.users;
			$scope.userListLength = data.users.length;
			if($scope.tag == 1 && $scope.userListLength == 1){
				var confirmPopup = $ionicPopup.confirm({
					title: '系统提示',
					template: '<div class="txtCenter">剩余工号：'+data.users[0].userName+'<br/>设为默认吗？</div>',
					buttons: [
						{ text: '否' },
						{
							text: '<b>是</b>',
							type: 'button-positive',
							onTap: function(e) {
								$scope.nowGoDefault(data.users[0].id);
							}
						}
					]
				});
			}
		}).error(function () {
			my.alert('数据信息获取失败，请稍后尝试！');
		});
	};
	// create account...
	$scope.createAccount = function () {
		$state.go('mSg-developers-list');
	};
	// change password...
	$scope.changePwd = function (_id) {
		localStorage.setItem('mSgFormType', _id);
		$state.go('mSg-form');
	};
	//设置码上购默认工号
	$scope.nowGoDefault = function(id){
		$http({
			method: 'post',
			url: ajaxurl + 'nowGoApp/setAllDeptDefaultNowGo?token=' + $rootScope.token,
			data: {id:id}
		}).success(function (data) {
			if(data == true){
				my.alert('该工号已设置为默认码上购工号。');
			}
		}).error(function () {
			my.alert('数据信息获取失败，请稍后尝试！');
		});
	}

	// delete account...
	$scope.delAccount = function (_id, u) {
		var confirmPopup = $ionicPopup.confirm({
			title: '系统提示',
			template: '确定删除 '+u+' 账号吗？',
			buttons: [
				{ text: '取消' },
				{
					text: '<b>确认</b>',
					type: 'button-positive',
					onTap: function(e) {
						$scope.tag = 1;
						_delAccountFun(_id);
					}
				}
			]
		});
	};
	

	function _delAccountFun (e) {
		$http({
			method: 'post',
			url: ajaxurl + 'nowGoApp/delAccount',
			data: {id: e, token: $rootScope.token}
		}).success(function (data) {
			if (data === true) {
				getAccount();
			}
		}).error(function () {
			my.alert('数据信息获取失败，请稍后尝试！');
		});
	}
});