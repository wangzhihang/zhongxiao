appControllers.controller('cbss-developers-list', function($scope,$http,$ionicLoading,$rootScope,$ionicPopup,my,$state) {
	$scope.title = 'CBSS发展人列表';
	$scope.cbssUserName = localStorage.getItem('cbssUserName');
	$scope.cbssUserPwd = localStorage.getItem('cbssUserPwd');
	$scope.developersList = [];
	$scope.cbssDevelopersList = JSON.parse(localStorage.getItem('cbssDevelopersList'));
	//循环输出列表
	$("<table>" + $scope.cbssDevelopersList.data + "</table>").find('tr').each(function(index, el) {
		$scope.developersList.push(
			{
				"developName":$(this).find('td:eq(4)').text()
				,"developCode":$(this).find('td:eq(1)').text()
				,"channelName":$(this).find('td:eq(3)').text()
				,"channelCode":$(this).find('td:eq(2)').text()
				,"developPhone":$(this).find('td:eq(5)').text()
			}
		);
	});
	//保存
	$scope.save = function(index){
		$ionicPopup.confirm({
	    	title: '系统提示',
	    	template: '确认创建CBSS工号？',
	    	buttons:[
		    	{
	    			text: '取消',
	   				type: 'button-default',
	   				onTap: function(e) {
				     //console.log('取消提交');
				    }
	  			},
	  			{
	    			text: '确认',
	   				type: 'button-calm',
	   				onTap: function(e) {
	   					$ionicLoading.show({template: '工号添加中...'});
				    	$http({
							method:'post',
							url:ajaxurl + 'cbssInfoApp/saveCbssInfo?token=' + $rootScope.token,
							data:{
								userName:$scope.cbssUserName,
								password:$scope.cbssUserPwd,
								province:signInInfo.cbssCode,
								developCode:$scope.developersList[index].developCode.trim(),
								channelName:$scope.developersList[index].channelName.trim(),
								channelCode:$scope.developersList[index].channelCode.trim(),
								developName:$scope.developersList[index].developName.trim(),
								developPhone:$scope.developersList[index].developPhone.trim(),
								ifTest:localStorage.getItem('ifTest')
							}
						}).success(function(data){
							$ionicLoading.hide();
							if(data.result == true){
								//console.log('成功');
								my.alert('添加成功！');
							}else{
								my.alert(data.errMsg);
							}
							$state.go('cbss-account-list');
						});
				    }
	  			}
	    	]
	    });
	};
});