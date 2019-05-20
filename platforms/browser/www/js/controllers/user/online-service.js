appControllers.controller('onlineService', function($scope,$timeout,$http,$rootScope,$ionicLoading) {
	$scope.title = '在线客服';
	$scope.btnState = true;
	$scope.reply = {info: ''};
	$scope.chatInfo = [];
	$scope.static = []; // 暂存数据
	
	// 初始化获取信息
	// $ionicLoading.show({template: '<ion-spinner icon="ios-small" class="spinner-light"></ion-spinner><p>正在获取服务器信息</p>'});
	getNews();
	getOldNews();
	// 输入检测
	$scope.inputInfo = function() {
		if ($scope.reply.info != '') {
			$scope.btnState = false;
		}else{
			$scope.btnState = true;
		}
	};
	// 发送
	$scope.reply = function() {
		$scope.btnState = true;
		$ionicLoading.show({
			template: '正在发送...'
		});
		$http({
			method:'POST',
			url: ajaxurl + 'customer/clientSendNews',
			data: {news: $scope.reply.info, token: $rootScope.token}
		}).success(function(data){
			if (data === true) {
				$ionicLoading.show({
					template: '发送成功！'
				});
				$timeout(function(){
					$ionicLoading.hide();
				},1500);
				// 暂存发送后的信息
				$scope.static.push({news: $scope.reply.info, time:'', user:'user'})
				console.log($scope.static);
				console.log('获取信息：' + $scope.reply.info);
				// 清空文本内容，恢复
				$scope.reply.info = '';
			}
		})
	};
	// 获取消息
	function getNews() {
		$http({
			method:'GET',
			url: ajaxurl + 'customer/clientGetNews',
			params: {token: $rootScope.token}
		}).success(function(data){
			$ionicLoading.hide();
			$scope.chatInfo.concat(data);
			console.log($scope.ltInfo);
		})
	};
	// 获取历史记录
	function getOldNews() {
		$http({
			method:'GET',
			url: ajaxurl + 'customer/clientGetOldNews',
			params: {token: $rootScope.token}
		}).success(function(data){
			$ionicLoading.hide();
			for (var i in data) {
				if (data[i].user === 'admin') {
					data[i].avatar = 'img/logo.png';
					$scope.chatInfo.push(data[i]);
				}else if (data[i].user === 'user') {
					data[i].avatar = 'img/user-pic.png';
					$scope.chatInfo.push(data[i]);
				}
			}
		})
	};
})